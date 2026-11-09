// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {EverlastingMath} from "../src/libs/EverlastingMath.sol";
import {EverlastingGreeks} from "../src/libs/EverlastingGreeks.sol";
import {Funding} from "../src/libs/Funding.sol";

contract InvariantsFuzzTest is Test {
    uint256 constant WAD = 1e18;

    /// @dev Fuzz testing: Mark price must always be strictly greater than or equal to intrinsic payoff
    function testFuzz_TimeValueNonNegative(
        uint256 spot,
        uint256 strike,
        uint64 sigmaBps,
        uint64 tau,
        bool isCall
    ) public pure {
        // Bound inputs to reasonable equity market ranges
        spot = bound(spot, 1 * WAD, 10000 * WAD);
        strike = bound(strike, 1 * WAD, 10000 * WAD);
        sigmaBps = uint64(bound(uint256(sigmaBps), 1000, 20000)); // 10% to 200% IV
        tau = uint64(bound(uint256(tau), 3600, 31536000)); // 1 hour to 1 year

        uint256 price = EverlastingMath.price(spot, strike, sigmaBps, tau, isCall);
        uint256 payoff = EverlastingMath.payoff(spot, strike, isCall);

        assertTrue(price >= payoff, "Option price must be >= intrinsic payoff (time value >= 0)");
    }

    /// @dev Fuzz testing: Normalization factor must be monotonically non-increasing
    function testFuzz_NormMonotonicallyDecreasing(
        uint128 initialNorm,
        uint256 vMark,
        uint256 payoff,
        uint64 tau,
        uint64 elapsed
    ) public pure {
        initialNorm = uint128(bound(uint256(initialNorm), 1e15, 1e18));
        vMark = bound(vMark, 1 * WAD, 1000 * WAD);
        payoff = bound(payoff, 0, vMark);
        tau = uint64(bound(uint256(tau), 86400, 604800));
        elapsed = uint64(bound(uint256(elapsed), 0, 30 days));

        uint128 newNorm = Funding.accrueNorm(initialNorm, vMark, payoff, tau, elapsed);

        assertTrue(newNorm <= initialNorm, "Norm must never increase over time");
        assertTrue(newNorm > 0, "Norm must remain positive for non-zero initial norm");
    }

    /// @dev Fuzz testing: Delta bounds across all parameter ranges
    function testFuzz_DeltaBounds(
        uint256 spot,
        uint256 strike,
        uint64 sigmaBps,
        uint64 tau
    ) public pure {
        spot = bound(spot, 1 * WAD, 10000 * WAD);
        strike = bound(strike, 1 * WAD, 10000 * WAD);
        sigmaBps = uint64(bound(uint256(sigmaBps), 1000, 20000));
        tau = uint64(bound(uint256(tau), 86400, 604800));

        int256 callDelta = EverlastingGreeks.delta(spot, strike, sigmaBps, tau, true);
        int256 putDelta = EverlastingGreeks.delta(spot, strike, sigmaBps, tau, false);

        assertTrue(callDelta >= 0 && callDelta <= int256(WAD), "Call delta must be in [0, 1]");
        assertTrue(putDelta <= 0 && putDelta >= -int256(WAD), "Put delta must be in [-1, 0]");
    }
}
