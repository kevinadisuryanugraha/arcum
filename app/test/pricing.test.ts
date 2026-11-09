import { describe, expect, it } from "bun:test";
import { priceEverlasting, calculateAlpha } from "../src/pricing/everlasting";

describe("Arcum TypeScript Everlasting Pricing Math", () => {
  const SIGMA_50 = 5000;
  const DAILY_TAU = 86400;
  const WEEKLY_TAU = 604800;

  it("calculates characteristic alpha accurately", () => {
    const alphaDaily = calculateAlpha(SIGMA_50, DAILY_TAU);
    const alphaWeekly = calculateAlpha(SIGMA_50, WEEKLY_TAU);

    expect(alphaDaily).toBeGreaterThan(1);
    expect(alphaWeekly).toBeGreaterThan(1);
    expect(alphaDaily).toBeGreaterThan(alphaWeekly);
  });

  it("verifies Call and Put equality at the money (S = K)", () => {
    const callQuote = priceEverlasting({
      spot: 100,
      strike: 100,
      sigmaBps: SIGMA_50,
      tauSeconds: DAILY_TAU,
      isCall: true
    });

    const putQuote = priceEverlasting({
      spot: 100,
      strike: 100,
      sigmaBps: SIGMA_50,
      tauSeconds: DAILY_TAU,
      isCall: false
    });

    expect(callQuote.price).toBeCloseTo(putQuote.price, 6);
    expect(callQuote.price).toBeGreaterThan(0);
    expect(callQuote.delta).toBeCloseTo(0.536, 1);
    expect(putQuote.delta).toBeCloseTo(-0.463, 1);
    expect(callQuote.delta - putQuote.delta).toBeCloseTo(1, 4);
  });

  it("verifies Call-Put parity: Call - Put = S - K", () => {
    const spot = 120;
    const strike = 100;

    const callQuote = priceEverlasting({
      spot,
      strike,
      sigmaBps: SIGMA_50,
      tauSeconds: DAILY_TAU,
      isCall: true
    });

    const putQuote = priceEverlasting({
      spot,
      strike,
      sigmaBps: SIGMA_50,
      tauSeconds: DAILY_TAU,
      isCall: false
    });

    const diff = callQuote.price - putQuote.price;
    expect(diff).toBeCloseTo(spot - strike, 4);
  });
});
