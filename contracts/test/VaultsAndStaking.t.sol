// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {CoveredUpVault} from "../src/CoveredUpVault.sol";
import {VaultRegistry} from "../src/VaultRegistry.sol";
import {ArcumStaking} from "../src/ArcumStaking.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockStockToken is ERC20 {
    constructor() ERC20("Mock Stock", "mNVDA") {
        _mint(msg.sender, 1000000 * 1e18);
    }
}

contract VaultsAndStakingTest is Test {
    CoveredUpVault vault;
    VaultRegistry registry;
    ArcumStaking staking;
    MockStockToken stock;

    address pool = address(0x8888);
    address user = address(0x9999);

    function setUp() public {
        stock = new MockStockToken();
        registry = new VaultRegistry(pool);
        vault = new CoveredUpVault(address(stock), address(0), address(registry), 86400);
        staking = new ArcumStaking(pool, address(stock), address(0));

        registry.addVault(address(vault));
        stock.transfer(user, 1000 * 1e18);
    }

    function testVaultStartsClosedByDefault() public view {
        // As required by Section 4 & 18 of brief: starts closed
        assertFalse(vault.open(), "Vault must start closed by default");
    }

    function testVaultDepositWhenOpened() public {
        vault.setOpen(true);
        assertTrue(vault.open(), "Vault should be open after owner enables");

        vm.startPrank(user);
        stock.approve(address(vault), type(uint256).max);
        vault.deposit(100 * 1e18);
        vm.stopPrank();

        assertEq(vault.pendingDeposits(user), 100 * 1e18);

        // Claim after roll
        vm.prank(user);
        vault.claim();
        assertEq(vault.sharesOf(user), 100 * 1e18);
        assertEq(vault.collateral(), 100 * 1e18);
    }

    function testStakingZeroSlashSafeAtLaunch() public {
        // Pool calls slash -> safely returns 0 without revert
        vm.prank(pool);
        uint256 sent = staking.slash(5000 * 1e6);
        assertEq(sent, 0, "Slash must return 0 safely before token route activation");
    }
}
