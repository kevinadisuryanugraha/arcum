// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {AgentRouter} from "../src/AgentRouter.sol";
import {ArcumEngine} from "../src/ArcumEngine.sol";
import {SeriesRegistry} from "../src/SeriesRegistry.sol";
import {PriceGuard} from "../src/PriceGuard.sol";
import {OptionToken} from "../src/OptionToken.sol";
import {Series} from "../src/libs/OptionTypes.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDGAgent is ERC20 {
    constructor() ERC20("USDG", "USDG") {
        _mint(msg.sender, 10000000 * 1e6);
    }
    function decimals() public pure override returns (uint8) { return 6; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract AgentRouterTest is Test {
    AgentRouter router;
    ArcumEngine engine;
    SeriesRegistry registry;
    PriceGuard priceGuard;
    MockUSDGAgent usdg;

    address constant NVDA = 0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC;
    address constant TSLA = 0x322F0929c4625eD5bAd873c95208D54E1c003b2d;

    address ownerUser = address(0x5555);
    address agentKey = address(0x6666);
    address pool = address(0x7777);

    bytes32 nvdaSeriesId;
    bytes32 tslaSeriesId;

    function setUp() public {
        usdg = new MockUSDGAgent();
        priceGuard = new PriceGuard();
        registry = new SeriesRegistry();

        engine = new ArcumEngine(address(registry), address(priceGuard), address(usdg), pool);
        router = new AgentRouter(address(engine));

        registry.setEngine(address(engine));
        registry.setAllowedStock(NVDA, true);
        registry.setAllowedStock(TSLA, true);

        // Prices: NVDA $145, TSLA $250
        priceGuard.setMockPrice(NVDA, 145 * 1e18);
        priceGuard.setMockPrice(TSLA, 250 * 1e18);

        // List series
        nvdaSeriesId = registry.listSeries(NVDA, true, 145 * 1e18, 86400);
        tslaSeriesId = registry.listSeries(TSLA, true, 250 * 1e18, 86400);

        // Warp to NYSE regular hours
        vm.warp(4 * 86400 + 54000);

        // Fund owner with USDG
        usdg.mint(ownerUser, 20000 * 1e6);

        // Set policy: Owner grants Agent budget = 1,000 USDG, max per trade = 500 USDG, allowed stocks = [NVDA]
        address[] memory allowed = new address[](1);
        allowed[0] = NVDA;

        vm.startPrank(ownerUser);
        usdg.approve(address(router), type(uint256).max);
        router.setPolicy(
            agentKey,
            1000 * 1e6, // budget: 1000 USDG
            500 * 1e6,  // max per trade: 500 USDG
            uint64(block.timestamp + 7 days), // expiry: 7 days
            true,       // canSell
            true,       // canShield
            allowed
        );
        vm.stopPrank();
    }

    function testAgentCanBuyWithinBudget() public {
        uint64 deadline = uint64(block.timestamp + 3600);

        vm.startPrank(agentKey);
        (uint256 cost, uint256 tokens) = router.buyFor(
            ownerUser,
            nvdaSeriesId,
            10 * 1e18, // 10 units
            200 * 1e6, // max cost
            deadline
        );
        vm.stopPrank();

        assertTrue(cost > 0, "Cost must be > 0");
        assertTrue(tokens > 0, "Tokens must be minted");

        // Verify tokens are minted to OWNER, NOT the agent!
        Series memory s = registry.seriesOf(nvdaSeriesId);
        assertEq(OptionToken(s.token).balanceOf(ownerUser), tokens);
        assertEq(OptionToken(s.token).balanceOf(agentKey), 0);

        // Remaining budget should decrease
        uint256 rem = router.remainingBudget(ownerUser, agentKey);
        assertEq(rem, 1000 * 1e6 - cost);
    }

    function testAgentCannotTradeUnallowedStock() public {
        uint64 deadline = uint64(block.timestamp + 3600);

        // Agent tries to trade TSLA (which is not in allowed stocks list)
        vm.startPrank(agentKey);
        vm.expectRevert();
        router.buyFor(ownerUser, tslaSeriesId, 10 * 1e18, 500 * 1e6, deadline);
        vm.stopPrank();
    }

    function testAgentCannotTradeExceedingMaxPerTrade() public {
        uint64 deadline = uint64(block.timestamp + 3600);

        // Max per trade is 500 USDG; buying 10,000 units requires thousands of USDG
        vm.startPrank(agentKey);
        vm.expectRevert();
        router.buyFor(ownerUser, nvdaSeriesId, 5000 * 1e18, 50000 * 1e6, deadline);
        vm.stopPrank();
    }

    function testOwnerCanRevokeAgentPolicy() public {
        uint64 deadline = uint64(block.timestamp + 3600);

        // Owner revokes
        vm.prank(ownerUser);
        router.revoke(agentKey);

        // Agent attempts to buy -> reverts PolicyIsRevoked
        vm.startPrank(agentKey);
        vm.expectRevert();
        router.buyFor(ownerUser, nvdaSeriesId, 10 * 1e18, 200 * 1e6, deadline);
        vm.stopPrank();
    }
}
