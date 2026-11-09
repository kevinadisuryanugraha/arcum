import { describe, expect, it } from "bun:test";
import { calculateEpochRewards } from "../src/rewards/rewards";

describe("Arcum Writer Rewards Engine", () => {
  it("calculates time-weighted points and enforces 10% per-wallet cap", () => {
    const deposits = [
      { account: "0xUserA", depositAmountUsdg: 100000, durationSeconds: 86400 * 7 }, // Whale (dominates 90% of pool)
      { account: "0xUserB", depositAmountUsdg: 5000, durationSeconds: 86400 * 7 },
      { account: "0xUserC", depositAmountUsdg: 2000, durationSeconds: 86400 * 7 },
      { account: "0xDust", depositAmountUsdg: 50, durationSeconds: 86400 * 7 }, // Ineligible dust (<1000 USDG)
    ];

    const config = {
      epochId: 1,
      totalRewardTokens: 1000000, // 1M tokens per epoch
      minEligibilityUsdg: 1000,
      maxWalletCapPct: 10, // 10% cap = 100,000 max tokens per wallet
      excludedAccounts: ["0xBlacklisted"],
    };

    const res = calculateEpochRewards(deposits, config);

    expect(res.allocations.length).toBe(3); // UserA, UserB, UserC (Dust excluded)

    const whaleAlloc = res.allocations.find((a) => a.account === "0xUserA");
    expect(whaleAlloc).toBeDefined();
    // Whale must be capped at 100,000 tokens (10% max cap)
    expect(whaleAlloc!.rewardTokens).toBe(100000);
    expect(whaleAlloc!.sharePct).toBe(10);
  });
});
