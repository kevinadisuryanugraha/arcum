// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {ArcumEngine} from "../src/ArcumEngine.sol";
import {SeriesRegistry} from "../src/SeriesRegistry.sol";
import {PriceGuard} from "../src/PriceGuard.sol";
import {OptionToken} from "../src/OptionToken.sol";
import {Series} from "../src/libs/OptionTypes.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDGShield is ERC20 {
    constructor() ERC20("USDG", "USDG") {
        _mint(msg.sender, 10000000 * 1e6);
    }
    function decimals() public pure override returns (uint8) { return 6; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract ShieldTest is Test {
    ArcumEngine engine;
    SeriesRegistry registry;
    PriceGuard priceGuard;
    MockUSDGShield usdg;

    address constant NVDA = 0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC;
    address user = address(0x3333);
    address pool = address(0x4444);

    bytes32 weeklyPutSeriesId;

    function setUp() public {
        usdg = new MockUSDGShield();
        priceGuard = new PriceGuard();
        registry = new SeriesRegistry();

        engine = new ArcumEngine(address(registry), address(priceGuard), address(usdg), pool);

        registry.setEngine(address(engine));
        registry.setAllowedStock(NVDA, true);

        // Price: NVDA at $145 WAD
        priceGuard.setMockPrice(NVDA, 145 * 1e18);

        // Target 5% below spot: $145 * 0.95 = $137.75 WAD
        uint128 targetStrike = uint128(145 * 1e18 * 9500 / 10000);

        // List Weekly Down Put series
        weeklyPutSeriesId = registry.listSeries(NVDA, false, targetStrike, 604800); // 7 days tau

        // Warp to regular trading hours (Thursday 11 AM ET)
        vm.warp(4 * 86400 + 54000);

        // Fund user
        usdg.mint(user, 10000 * 1e6);
    }

    function testShieldAutomatedPutPurchase() public {
        uint128 heldUnits = 50 * 1e18; // 50 NVDA tokens held
        uint16 strikePctBelowBps = 500; // 5% below spot
        uint64 deadline = uint64(block.timestamp + 3600);

        vm.startPrank(user);
        usdg.approve(address(engine), type(uint256).max);

        (bytes32 id, uint256 costUsdg) = engine.shield(
            NVDA,
            heldUnits,
            strikePctBelowBps,
            2000 * 1e6, // max cost
            deadline
        );
        vm.stopPrank();

        assertEq(id, weeklyPutSeriesId, "Shield must select registered Weekly Put series");
        assertTrue(costUsdg > 0, "Cost must be > 0");

        // Verify user received Weekly Put OptionTokens
        Series memory s = registry.seriesOf(weeklyPutSeriesId);
        assertEq(OptionToken(s.token).balanceOf(user), heldUnits, "User must receive put protection tokens matching stock units");
    }
}
