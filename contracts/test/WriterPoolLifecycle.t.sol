// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {WriterPool} from "../src/WriterPool.sol";
import {PriceGuard} from "../src/PriceGuard.sol";
import {IOptionEngine} from "../src/interfaces/IOptionEngine.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDGPool is ERC20 {
    constructor() ERC20("USDG", "USDG") {
        _mint(msg.sender, 10000000 * 1e6);
    }
    function decimals() public pure override returns (uint8) { return 6; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract WriterPoolLifecycleTest is Test {
    WriterPool pool;
    PriceGuard priceGuard;
    MockUSDGPool usdg;

    address admin = address(0xAAAA);
    address lpUser = address(0xBBBB);

    function setUp() public {
        usdg = new MockUSDGPool();
        priceGuard = new PriceGuard();

        // 72h queue delay
        WriterPool poolImpl = new WriterPool(72 hours);

        bytes memory initData = abi.encodeWithSelector(
            WriterPool.initialize.selector,
            admin,
            usdg,
            IOptionEngine(address(0)),
            priceGuard
        );

        ERC1967Proxy proxy = new ERC1967Proxy(address(poolImpl), initData);
        pool = WriterPool(address(proxy));

        vm.startPrank(admin);
        pool.setPublicDeposits(true);
        pool.setNavGuard(500, 1000); // 5% open, 10% closed guard
        vm.stopPrank();

        // Fund user
        usdg.mint(lpUser, 50000 * 1e6); // 50,000 USDG
    }

    function testDepositLockAndWithdrawalQueue() public {
        uint256 depositAssets = 10000 * 1e6; // 10,000 USDG

        // 1. User deposits
        vm.startPrank(lpUser);
        usdg.approve(address(pool), type(uint256).max);
        uint256 shares = pool.deposit(depositAssets, lpUser);
        vm.stopPrank();

        assertTrue(shares > 0, "Shares must be minted");
        assertEq(pool.balanceOf(lpUser), shares);

        // 2. Deposit lock enforced: trying to request withdrawal immediately reverts
        vm.startPrank(lpUser);
        vm.expectRevert();
        pool.requestWithdraw(shares);
        vm.stopPrank();

        // 3. Advance time past 24-hour deposit lock
        vm.warp(block.timestamp + 1 days + 10);

        // 4. Request withdrawal (opens 72-hour notice ticket)
        vm.startPrank(lpUser);
        uint256 ticket = pool.requestWithdraw(shares / 2);
        vm.stopPrank();

        assertEq(ticket, 1, "First ticket ID must be 1");

        // 5. Trying to claim before 72 hours reverts
        vm.startPrank(lpUser);
        vm.expectRevert();
        pool.claim(ticket);
        vm.stopPrank();

        // 6. Advance time past 72 hours
        vm.warp(block.timestamp + 72 hours + 10);

        // 7. Claim withdrawal succeeds
        uint256 balBefore = usdg.balanceOf(lpUser);
        vm.startPrank(lpUser);
        uint256 payout = pool.claim(ticket);
        vm.stopPrank();

        assertTrue(payout > 0, "Payout must be > 0 USDG");
        assertEq(usdg.balanceOf(lpUser), balBefore + payout);
    }
}
