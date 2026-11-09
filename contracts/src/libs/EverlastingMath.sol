// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FixedMath} from "./FixedMath.sol";

/// @title EverlastingMath
/// @notice Closed-form Everlasting Options pricing library for Arcum protocol.
/// @dev Solves the Euler-Cauchy ODE under continuous geometric Brownian motion:
///      1/2 * sigma^2 * S^2 * V''(S) - (1/tau) * V(S) + (1/tau) * Payoff(S) = 0
library EverlastingMath {
    using FixedMath for uint256;

    uint256 internal constant WAD = 1e18;
    uint256 internal constant SECONDS_PER_YEAR = 31536000;

    error InvalidStrike();
    error InvalidSpot();
    error InvalidSigma();
    error InvalidTau();

    /// @notice Computes characteristic parameter alpha:
    ///         alpha = (1 + sqrt(1 + 8 / (sigma^2 * tau))) / 2
    /// @param sigmaBps Annualized volatility in basis points (e.g. 5000 = 50%)
    /// @param tau Funding speed in seconds (Daily = 86400, Weekly = 604800)
    function calculateAlpha(uint64 sigmaBps, uint64 tau) public pure returns (uint256 alphaWad) {
        if (sigmaBps == 0) revert InvalidSigma();
        if (tau == 0) revert InvalidTau();

        // sigma in WAD: (sigmaBps * 1e18) / 10000
        uint256 sigmaWad = (uint256(sigmaBps) * WAD) / 10000;
        // sigma^2 in WAD:
        uint256 sigmaSqWad = sigmaWad.wadMul(sigmaWad);

        // tau in years WAD: (tau * WAD) / SECONDS_PER_YEAR
        uint256 tauYearsWad = (uint256(tau) * WAD) / SECONDS_PER_YEAR;

        // denominator = sigma^2 * tau
        uint256 denomWad = sigmaSqWad.wadMul(tauYearsWad);
        if (denomWad == 0) denomWad = 1;

        // term = 8 / (sigma^2 * tau)
        uint256 termWad = (8 * WAD).wadDiv(denomWad);

        // discriminant = 1 + term
        uint256 discWad = WAD + termWad;
        uint256 sqrtDiscWad = FixedMath.wadSqrt(discWad);

        // alpha = (1 + sqrtDisc) / 2
        alphaWad = (WAD + sqrtDiscWad) / 2;
    }

    /// @notice Solves closed-form price of an everlasting option (Up / Call or Down / Put).
    /// @param spotWad Current underlying price in WAD (18 decimals)
    /// @param strikeWad Strike price in WAD (18 decimals)
    /// @param sigmaBps Implied volatility in bps
    /// @param tau Funding interval in seconds
    /// @param isCall True for Up (Call), False for Down (Put)
    function price(
        uint256 spotWad,
        uint256 strikeWad,
        uint64 sigmaBps,
        uint64 tau,
        bool isCall
    ) public pure returns (uint256 priceWad) {
        if (spotWad == 0) revert InvalidSpot();
        if (strikeWad == 0) revert InvalidStrike();

        uint256 alphaWad = calculateAlpha(sigmaBps, tau);
        uint256 denomCoeff = 2 * alphaWad - WAD; // 2*alpha - 1

        if (isCall) {
            // Call Option
            if (spotWad <= strikeWad) {
                // S <= K: V_call = (K / (2*alpha - 1)) * (S / K)^alpha
                uint256 ratioWad = spotWad.wadDiv(strikeWad);
                uint256 powRatio = FixedMath.wadPow(ratioWad, alphaWad);
                uint256 baseVal = strikeWad.wadDiv(denomCoeff);
                priceWad = baseVal.wadMul(powRatio);
            } else {
                // S > K: V_call = (S - K) + (K / (2*alpha - 1)) * (K / S)^(alpha - 1)
                uint256 intrinsic = spotWad - strikeWad;
                uint256 ratioWad = strikeWad.wadDiv(spotWad);
                uint256 expWad = alphaWad - WAD;
                uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
                uint256 baseVal = strikeWad.wadDiv(denomCoeff);
                priceWad = intrinsic + baseVal.wadMul(powRatio);
            }
        } else {
            // Put Option (Down)
            if (spotWad >= strikeWad) {
                // S >= K: V_put = (K / (2*alpha - 1)) * (K / S)^(alpha - 1)
                uint256 ratioWad = strikeWad.wadDiv(spotWad);
                uint256 expWad = alphaWad - WAD;
                uint256 powRatio = FixedMath.wadPow(ratioWad, expWad);
                uint256 baseVal = strikeWad.wadDiv(denomCoeff);
                priceWad = baseVal.wadMul(powRatio);
            } else {
                // S < K: V_put = (K - S) + (K / (2*alpha - 1)) * (S / K)^alpha
                uint256 intrinsic = strikeWad - spotWad;
                uint256 ratioWad = spotWad.wadDiv(strikeWad);
                uint256 powRatio = FixedMath.wadPow(ratioWad, alphaWad);
                uint256 baseVal = strikeWad.wadDiv(denomCoeff);
                priceWad = intrinsic + baseVal.wadMul(powRatio);
            }
        }
    }

    /// @notice Computes intrinsic payoff: max(S - K, 0) for Up, max(K - S, 0) for Down
    function payoff(uint256 spotWad, uint256 strikeWad, bool isCall) public pure returns (uint256 payoffWad) {
        if (isCall) {
            payoffWad = spotWad > strikeWad ? spotWad - strikeWad : 0;
        } else {
            payoffWad = strikeWad > spotWad ? strikeWad - spotWad : 0;
        }
    }
}
