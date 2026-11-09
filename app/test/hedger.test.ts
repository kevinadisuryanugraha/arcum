import { describe, expect, it } from "bun:test";
import { ArcumDeltaHedger } from "../src/hedger/hedger";

describe("Arcum Delta Hedger", () => {
  it("generates spot purchase intent when option delta exceeds spot inventory", () => {
    const hedger = new ArcumDeltaHedger(50000, 100, 0.10);

    const intent = hedger.evaluateRebalance({
      stock: 'NVDA',
      netDelta: 100, // Traders hold +100 delta
      currentSpotUnits: 50, // Pool holds 50 spot NVDA
      spotPriceUsdg: 145.0,
      poolUsdgCash: 100000.0,
    });

    expect(intent.approved).toBe(true);
    expect(intent.isBuy).toBe(true);
    expect(intent.unitsToSwap).toBeCloseTo(50, 2);
    expect(intent.estUsdgValue).toBeCloseTo(50 * 145.0, 2);
    expect(intent.maxSlippageBps).toBe(100);
  });

  it("caps rebalance intent to maxSingleRebalanceUsdg", () => {
    const hedger = new ArcumDeltaHedger(10000, 100, 0.10); // Cap at 10,000 USDG

    const intent = hedger.evaluateRebalance({
      stock: 'TSLA',
      netDelta: 500, // Wants 500 units @ $250 = $125,000
      currentSpotUnits: 0,
      spotPriceUsdg: 250.0,
      poolUsdgCash: 200000.0,
    });

    expect(intent.approved).toBe(true);
    expect(intent.estUsdgValue).toBe(10000);
    expect(intent.unitsToSwap).toBe(40); // 10,000 / 250 = 40 units
  });

  it("rejects rebalance if within tolerance band", () => {
    const hedger = new ArcumDeltaHedger();

    const intent = hedger.evaluateRebalance({
      stock: 'SPY',
      netDelta: 100.005,
      currentSpotUnits: 100.0,
      spotPriceUsdg: 585.0,
      poolUsdgCash: 100000.0,
    });

    expect(intent.approved).toBe(false);
    expect(intent.rejectionReason).toBe('Delta within tolerance band');
  });
});
