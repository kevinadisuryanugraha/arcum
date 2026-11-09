/**
 * Arcum Pool Delta Hedger (Bun/TypeScript)
 * Computes net options delta exposure and generates bounded spot hedge rebalances.
 */

export interface StockExposure {
  stock: string;
  netDelta: number; // In whole stock token units
  currentSpotUnits: number;
  spotPriceUsdg: number;
  poolUsdgCash: number;
}

export interface HedgeRebalanceIntent {
  stock: string;
  isBuy: boolean;
  unitsToSwap: number;
  estUsdgValue: number;
  maxSlippageBps: number;
  approved: boolean;
  rejectionReason?: string;
}

export class ArcumDeltaHedger {
  public maxSingleRebalanceUsdg: number;
  public maxSlippageBps: number;
  public cashBufferPct: number;

  constructor(
    maxSingleRebalanceUsdg: number = 50000,
    maxSlippageBps: number = 100, // 1%
    cashBufferPct: number = 0.10 // 10% cash buffer
  ) {
    this.maxSingleRebalanceUsdg = maxSingleRebalanceUsdg;
    this.maxSlippageBps = maxSlippageBps;
    this.cashBufferPct = cashBufferPct;
  }

  /**
   * Evaluates current pool delta exposure and derives bounded swap intent
   */
  public evaluateRebalance(exp: StockExposure): HedgeRebalanceIntent {
    // The pool is counterparty to option holders:
    // If traders are long Calls (positive delta), the pool is short delta (-netDelta).
    // Target spot hedge = + traders' netDelta to neutralize portfolio delta.
    const targetHedgeUnits = exp.netDelta;
    const unitsDelta = targetHedgeUnits - exp.currentSpotUnits;

    if (Math.abs(unitsDelta) < 0.01) {
      return {
        stock: exp.stock,
        isBuy: false,
        unitsToSwap: 0,
        estUsdgValue: 0,
        maxSlippageBps: this.maxSlippageBps,
        approved: false,
        rejectionReason: 'Delta within tolerance band',
      };
    }

    const isBuy = unitsDelta > 0;
    const rawUnits = Math.abs(unitsDelta);
    let unitsToSwap = rawUnits;
    let estUsdgValue = unitsToSwap * exp.spotPriceUsdg;

    // Check single rebalance cap
    if (estUsdgValue > this.maxSingleRebalanceUsdg) {
      estUsdgValue = this.maxSingleRebalanceUsdg;
      unitsToSwap = estUsdgValue / exp.spotPriceUsdg;
    }

    // If buying spot, check cash buffer constraints
    if (isBuy) {
      const minCashRequired = exp.poolUsdgCash * this.cashBufferPct;
      const availableCash = Math.max(exp.poolUsdgCash - minCashRequired, 0);
      if (estUsdgValue > availableCash) {
        if (availableCash <= 0) {
          return {
            stock: exp.stock,
            isBuy: true,
            unitsToSwap: 0,
            estUsdgValue: 0,
            maxSlippageBps: this.maxSlippageBps,
            approved: false,
            rejectionReason: 'Insufficient USDG cash buffer',
          };
        }
        estUsdgValue = availableCash;
        unitsToSwap = estUsdgValue / exp.spotPriceUsdg;
      }
    }

    return {
      stock: exp.stock,
      isBuy,
      unitsToSwap,
      estUsdgValue,
      maxSlippageBps: this.maxSlippageBps,
      approved: true,
    };
  }
}
