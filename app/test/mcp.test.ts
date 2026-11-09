import { describe, expect, it } from "bun:test";
import { ArcumMCPHandler, QuoteToolSchema } from "../src/mcp/tools";

describe("Arcum MCP Tool Server", () => {
  it("validates parameters using Zod schemas", () => {
    const valid = QuoteToolSchema.safeParse({
      stock: 'NVDA',
      strike: 145,
      speed: 'DAILY',
      isCall: true,
      units: 10,
    });
    expect(valid.success).toBe(true);

    const invalid = QuoteToolSchema.safeParse({
      stock: 'INVALID_STOCK',
      strike: -10,
      speed: 'MONTHLY',
    });
    expect(invalid.success).toBe(false);
  });

  it("handles agent quote execution via MCP", () => {
    const result = ArcumMCPHandler.handleQuote({
      stock: 'NVDA',
      strike: 145,
      speed: 'DAILY',
      isCall: true,
      units: 10,
    });

    expect(result.stock).toBe('NVDA');
    expect(result.spot).toBe(142.50);
    expect(result.markPriceUsdg).toBeGreaterThan(0);
    expect(result.totalCostUsdg).toBeGreaterThan(result.markPriceUsdg * 10);
    expect(result.protocolFeeUsdg).toBeGreaterThan(0);
  });
});
