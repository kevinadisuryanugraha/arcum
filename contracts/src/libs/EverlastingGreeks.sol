// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FixedMath} from "./FixedMath.sol";
import {EverlastingMath} from "./EverlastingMath.sol";

/// @title EverlastingGreeks
/// @notice Computes closed-form Greeks (Delta, Gamma, Vega) for Arcum everlasting options.
library EverlastingGreeks {
    using FixedMath for uint256;

    uint256 internal constant WAD = 1e18;

    /// @notice Computes Delta: dV/dS
    function delta(
        uint256 spotWad,
        uint256 strikeWad,
        uint64 sigmaBps,
        uint64 tau,
        bool isCall
    ) external pure returns (int256 deltaWad) {
        uint256 alphaWad = EverlastingMath.calculateAlpha(sigmaBps, tau);
        uint256 denomCoeff = 2 * alphaWad - WAD;

        if (isCall) {
            if (spotWad <= strikeWad) {
                // Delta = (alpha / (2*alpha - 1)) * (S / K)^(alpha - 1)
                uint256 ratioWad = spotWad.wadDiv(strikeWad);
                uint256 expWad = alphaWad - WAD;
                uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
                uint256 coeff = alphaWad.wadDiv(denomCoeff);
                deltaWad = int256(coeff.wadMul(powRatio));
            } else {
                // Delta = 1 - ((alpha - 1) / (2*alpha - 1)) * (K / S)^alpha
                uint256 ratioWad = strikeWad.wadDiv(spotWad);
                uint256 powRatio = FixedMath.wadPow(ratioWad, alphaWad);
                uint256 coeff = (alphaWad - WAD).wadDiv(denomCoeff);
                uint256 decayTerm = coeff.wadMul(powRatio);
                deltaWad = int256(WAD - decayTerm);
            }
        } else {
            // Put Delta = Call Delta - 1
            if (spotWad >= strikeWad) {
                uint256 ratioWad = strikeWad.wadDiv(spotWad);
                uint256 powRatio = FixedMath.wadPow(ratioWad, alphaWad);
                uint256 coeff = (alphaWad - WAD).wadDiv(denomCoeff);
                uint256 term = coeff.wadMul(powRatio);
                deltaWad = -int256(term);
            } else {
                uint256 ratioWad = spotWad.wadDiv(strikeWad);
                uint256 expWad = alphaWad - WAD;
                uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
                uint256 coeff = alphaWad.wadDiv(denomCoeff);
                uint256 term = coeff.wadMul(powRatio);
                deltaWad = int256(term) - int256(WAD);
            }
        }
    }

    /// @notice Computes Gamma: d^2V/dS^2
    function gamma(
        uint256 spotWad,
        uint256 strikeWad,
        uint64 sigmaBps,
        uint64 tau
    ) external pure returns (uint256 gammaWad) {
        uint256 alphaWad = EverlastingMath.calculateAlpha(sigmaBps, tau);
        uint256 denomCoeff = 2 * alphaWad - WAD;
        uint256 numCoeff = alphaWad.wadMul(alphaWad - WAD);
        uint256 baseGamma = numCoeff.wadDiv(denomCoeff.wadMul(strikeWad));

        if (spotWad <= strikeWad) {
            uint256 ratioWad = spotWad.wadDiv(strikeWad);
            uint256 expWad = alphaWad > 2 * WAD ? alphaWad - 2 * WAD : 0;
            uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
            gammaWad = baseGamma.wadMul(powRatio);
        } else {
            uint256 ratioWad = strikeWad.wadDiv(spotWad);
            uint256 expWad = alphaWad + WAD;
            uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
            gammaWad = baseGamma.wadMul(powRatio);
        }
    }
}
