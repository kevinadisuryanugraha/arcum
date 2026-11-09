// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {SeriesRegistry} from "../src/SeriesRegistry.sol";
import {Series, Speed} from "../src/libs/OptionTypes.sol";
import {OptionToken} from "../src/OptionToken.sol";

contract SeriesRegistryTest is Test {
    SeriesRegistry registry;
    address constant NVDA = 0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC;
    uint256 constant WAD = 1e18;

    function setUp() public {
        registry = new SeriesRegistry();
        registry.setAllowedStock(NVDA, true);
        registry.setEngine(address(this));
    }

    function testListSeriesDailyUp() public {
        uint128 strike = 145 * 1e18; // $145 strike WAD
        uint32 tau = 86400; // Daily

        bytes32 id = registry.listSeries(NVDA, true, strike, tau);
        assertTrue(id != bytes32(0), "Valid series ID must be non-zero");

        Series memory s = registry.seriesOf(id);
        assertEq(s.stock, NVDA);
        assertTrue(s.isCall, "Must be Up / Call");
        assertEq(uint256(s.speed), uint256(Speed.DAILY));
        assertEq(s.strike, strike);
        assertEq(s.norm, uint128(WAD), "Initial norm must be 1 WAD");
        assertTrue(s.buyable, "Must be listed as buyable");
        assertFalse(s.archived, "Must not be archived");

        // OptionToken was deployed
        assertTrue(s.token != address(0), "OptionToken address must exist");
        OptionToken token = OptionToken(s.token);
        assertEq(token.symbol(), "UP");
    }

    function testEpochRelisting() public {
        uint128 strike = 145 * 1e18;
        uint32 tau = 86400;

        bytes32 id1 = registry.listSeries(NVDA, true, strike, tau);
        assertEq(registry.epochOf(id1), 0, "First epoch must be 0");

        // Relist same strike and tau creates epoch 1
        bytes32 id2 = registry.listSeries(NVDA, true, strike, tau);
        assertEq(registry.epochOf(id2), 1, "Second epoch must be 1");
        assertTrue(id1 != id2, "New epoch must have distinct ID");

        // Old epoch is archived
        Series memory s1 = registry.seriesOf(id1);
        assertTrue(s1.archived, "Previous epoch must be archived");
    }
}
