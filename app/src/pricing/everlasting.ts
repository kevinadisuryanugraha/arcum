/**
 * Arcum Everlasting Options Pricing Reference (TypeScript)
 * Solves the closed-form Euler-Cauchy ODE:
 * 1/2 * sigma^2 * S^2 * V''(S) - (1/tau) * V(S) + (1/tau) * Payoff(S) = 0
 */

export const SECONDS_PER_YEAR = 31536000;

export interface OptionQuoteParams {
  spot: number;       // S (e.g. 100 USDG)
  strike: number;     // K (e.g. 100 USDG)
  sigmaBps: number;   // Volatility in basis points (e.g. 5000 = 50%)
  tauSeconds: number; // Daily = 86400, Weekly = 604800
  isCall: boolean;    // true = Up / Call, false = Down / Put
}

export interface OptionQuoteResult {
  price: number;
  alpha: number;
  payoff: number;
  timeValue: number;
  delta: number;
  gamma: number;
  dailyDecay: number;
}

/**
 * Calculates characteristic parameter alpha:
 * alpha = (1 + sqrt(1 + 8 / (sigma^2 * tau))) / 2
 */
export function calculateAlpha(sigmaBps: number, tauSeconds: number): number {
  if (sigmaBps <= 0) throw new Error("sigmaBps must be positive");
  if (tauSeconds <= 0) throw new Error("tauSeconds must be positive");

  const sigma = sigmaBps / 10000;
  const tauYears = tauSeconds / SECONDS_PER_YEAR;

  const denom = (sigma * sigma) * tauYears;
  const term = 8 / denom;
  const disc = 1 + term;
  return (1 + Math.sqrt(disc)) / 2;
}

/**
 * Solves closed-form price of an everlasting option
 */
export function priceEverlasting(params: OptionQuoteParams): OptionQuoteResult {
  const { spot, strike, sigmaBps, tauSeconds, isCall } = params;

  if (spot <= 0) throw new Error("Spot must be positive");
  if (strike <= 0) throw new Error("Strike must be positive");

  const alpha = calculateAlpha(sigmaBps, tauSeconds);
  const denom = 2 * alpha - 1;

  let price = 0;
  let payoff = 0;

  if (isCall) {
    payoff = Math.max(spot - strike, 0);
    if (spot <= strike) {
      // S <= K: V = (K / (2*alpha - 1)) * (S / K)^alpha
      price = (strike / denom) * Math.pow(spot / strike, alpha);
    } else {
      // S > K: V = (S - K) + (K / (2*alpha - 1)) * (K / S)^(alpha - 1)
      price = (spot - strike) + (strike / denom) * Math.pow(strike / spot, alpha - 1);
    }
  } else {
    // Put
    payoff = Math.max(strike - spot, 0);
    if (spot >= strike) {
      // S >= K: V = (K / (2*alpha - 1)) * (K / S)^(alpha - 1)
      price = (strike / denom) * Math.pow(strike / spot, alpha - 1);
    } else {
      // S < K: V = (K - S) + (K / (2*alpha - 1)) * (S / K)^alpha
      price = (strike - spot) + (strike / denom) * Math.pow(spot / strike, alpha);
    }
  }

  const timeValue = Math.max(price - payoff, 0);

  // Delta
  let delta = 0;
  if (isCall) {
    if (spot <= strike) {
      delta = (alpha / denom) * Math.pow(spot / strike, alpha - 1);
    } else {
      delta = 1 - ((alpha - 1) / denom) * Math.pow(strike / spot, alpha);
    }
  } else {
    if (spot >= strike) {
      delta = -((alpha - 1) / denom) * Math.pow(strike / spot, alpha);
    } else {
      delta = (alpha / denom) * Math.pow(spot / strike, alpha - 1) - 1;
    }
  }

  // Gamma
  let gamma = 0;
  const numCoeff = (alpha * (alpha - 1)) / (denom * strike);
  if (spot <= strike) {
    gamma = numCoeff * Math.pow(spot / strike, alpha - 2);
  } else {
    gamma = numCoeff * Math.pow(strike / spot, alpha + 1);
  }

  // Daily Decay (holding cost in 1 day)
  const dailyDecay = (timeValue / tauSeconds) * 86400;

  return {
    price,
    alpha,
    payoff,
    timeValue,
    delta,
    gamma,
    dailyDecay
  };
}
