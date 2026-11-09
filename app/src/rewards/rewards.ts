/**
 * Arcum Writer Rewards Engine (Bun/TypeScript)
 * Computes time-weighted LP deposit points, 10% per-wallet cap, and payout allocations.
 */

export interface WriterDepositRecord {
  account: string;
  depositAmountUsdg: number;
  durationSeconds: number; // Time held within epoch
}

export interface EpochRewardsConfig {
  epochId: number;
  totalRewardTokens: number; // Total token budget for this epoch
  minEligibilityUsdg: number; // e.g. 1000 USDG minimum time-weighted
  maxWalletCapPct: number;    // e.g. 10% per-wallet cap
  excludedAccounts: string[];
}

export interface RewardAllocation {
  account: string;
  rawPoints: number;
  cappedPoints: number;
  rewardTokens: number;
  sharePct: number;
}

export function calculateEpochRewards(
  deposits: WriterDepositRecord[],
  config: EpochRewardsConfig
): { allocations: RewardAllocation[]; totalAllocated: number; unallocatedBurn: number } {
  const excludedSet = new Set(config.excludedAccounts.map((a) => a.toLowerCase()));

  // 1. Calculate time-weighted points per eligible account
  const accountPoints = new Map<string, number>();
  for (const dep of deposits) {
    if (excludedSet.has(dep.account.toLowerCase())) continue;
    const points = (dep.depositAmountUsdg * dep.durationSeconds) / 86400; // USDG-Days
    const current = accountPoints.get(dep.account) || 0;
    accountPoints.set(dep.account, current + points);
  }

  // 2. Filter by minimum eligibility
  const eligibleAccounts: { account: string; points: number }[] = [];
  let totalEligiblePoints = 0;
  for (const [account, points] of accountPoints.entries()) {
    if (points >= config.minEligibilityUsdg) {
      eligibleAccounts.push({ account, points });
      totalEligiblePoints += points;
    }
  }

  if (totalEligiblePoints === 0) {
    return { allocations: [], totalAllocated: 0, unallocatedBurn: config.totalRewardTokens };
  }

  // 3. Apply 10% per-wallet cap
  const maxTokensPerWallet = (config.totalRewardTokens * config.maxWalletCapPct) / 100;
  let totalAllocated = 0;
  const allocations: RewardAllocation[] = [];

  for (const item of eligibleAccounts) {
    const rawTokens = (item.points / totalEligiblePoints) * config.totalRewardTokens;
    const cappedTokens = Math.min(rawTokens, maxTokensPerWallet);
    totalAllocated += cappedTokens;

    allocations.push({
      account: item.account,
      rawPoints: item.points,
      cappedPoints: item.points,
      rewardTokens: cappedTokens,
      sharePct: (cappedTokens / config.totalRewardTokens) * 100,
    });
  }

  const unallocatedBurn = config.totalRewardTokens - totalAllocated;

  return {
    allocations,
    totalAllocated,
    unallocatedBurn,
  };
}
