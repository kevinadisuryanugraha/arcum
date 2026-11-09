/**
 * Arcum Model Context Protocol (MCP) Tools
 * Exposes bounded options trading capabilities to AI agents.
 */

import { z } from "zod";
import { priceEverlasting } from "../pricing/everlasting";

export const ChainToolSchema = z.object({
  stock: z.enum(['NVDA', 'TSLA', 'SPY', 'QQQ', 'AAPL']),
});

export const QuoteToolSchema = z.object({
  stock: z.enum(['NVDA', 'TSLA', 'SPY', 'QQQ', 'AAPL']),
  strike: z.number().positive(),
  speed: z.enum(['DAILY', 'WEEKLY']),
  isCall: z.boolean(),
  units: z.number().positive().default(1),
});

export const ShieldToolSchema = z.object({
  stock: z.enum(['NVDA', 'TSLA', 'SPY', 'QQQ', 'AAPL']),
  heldUnits: z.number().positive(),
  protectionPct: z.number().min(1).max(20).default(5),
});

export const MCP_TOOL_DEFINITIONS = [
  {
    name: "arcum_quote",
    description: "Calculates the exact closed-form price, delta, gamma, and daily holding decay for an everlasting option on Robinhood Chain.",
    parameters: QuoteToolSchema,
  },
  {
    name: "arcum_chain",
    description: "Returns listed strikes, IV, and session status for a specified tokenized stock.",
    parameters: ChainToolSchema,
  },
  {
    name: "arcum_shield",
    description: "Calculates automated Weekly Put protection for a Stock Token holding.",
    parameters: ShieldToolSchema,
  },
];

export class ArcumMCPHandler {
  public static handleQuote(input: z.infer<typeof QuoteToolSchema>) {
    const mockSpots: Record<string, number> = {
      NVDA: 142.50,
      TSLA: 248.80,
      SPY: 585.20,
      QQQ: 498.40,
      AAPL: 226.75,
    };
    const mockIvs: Record<string, number> = {
      NVDA: 5200,
      TSLA: 6400,
      SPY: 1800,
      QQQ: 2400,
      AAPL: 2800,
    };

    const spot = mockSpots[input.stock];
    const iv = mockIvs[input.stock];
    const tau = input.speed === 'DAILY' ? 86400 : 604800;

    const res = priceEverlasting({
      spot,
      strike: input.strike,
      sigmaBps: iv,
      tauSeconds: tau,
      isCall: input.isCall,
    });

    const tradeFeeUsdg = (res.price * input.units * 3) / 10000;
    const totalCostUsdg = res.price * input.units + tradeFeeUsdg;

    return {
      stock: input.stock,
      spot,
      strike: input.strike,
      markPriceUsdg: res.price,
      units: input.units,
      protocolFeeUsdg: tradeFeeUsdg,
      totalCostUsdg,
      delta: res.delta,
      gamma: res.gamma,
      dailyDecayUsdg: res.dailyDecay * input.units,
    };
  }
}
