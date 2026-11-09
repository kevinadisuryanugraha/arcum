// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FixedMath} from "./FixedMath.sol";

/// @title Funding
/// @notice Computes continuous exponential norm decay and holding cost for Arcum series.
library Funding {
    using FixedMath for uint256;

    uint256 internal constant WAD = 1e18;

    /// @notice Computes updated normalization factor after elapsed time dt:
    ///         Norm(t) = Norm(t0) * exp( - (timeValue / (vMark * tau)) * dt )
    /// @param currentNorm Current normalization factor (WAD)
    /// @param vMarkWad Current option mark price (WAD)
    /// @param payoffWad Current intrinsic payoff (WAD)
    /// @param tau Funding speed in seconds
    /// @param elapsed Elapsed calendar seconds
    function accrueNorm(
        uint128 currentNorm,
        uint256 vMarkWad,
        uint256 payoffWad,
        uint64 tau,
        uint64 elapsed
    ) external pure returns (uint128 newNorm) {
        if (elapsed == 0 || currentNorm == 0 || vMarkWad == 0 || tau == 0) {
            return currentNorm;
        }

        uint256 timeValueWad = vMarkWad > payoffWad ? vMarkWad - payoffWad : 0;
        if (timeValueWad == 0) {
            return currentNorm;
        }

        // ratePerSecWad = timeValue / (vMark * tau)
        uint256 denomWad = vMarkWad.wadMul(uint256(tau) * WAD);
        uint256 ratePerSecWad = timeValueWad.wadDiv(denomWad);

        // exponent = - ratePerSec * elapsed
        uint256 totalDecayWad = ratePerSecWad.wadMul(uint256(elapsed) * WAD);
        int256 negExponent = -int256(totalDecayWad);

        uint256 decayFactorWad = uint256(FixedMath.wadExp(negExponent));
        uint256 updatedNormWad = uint256(currentNorm).wadMul(decayFactorWad);

        newNorm = uint128(updatedNormWad);
    }
}
