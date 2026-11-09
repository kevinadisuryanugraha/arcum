/**
 * Arcum Account Abstraction & Paymaster Integration (ERC-4337)
 * Builds UserOperations, enforces daily sponsorship limits, and handles EOA fallback.
 */

export interface UserOperation {
  sender: string;
  nonce: bigint;
  callData: string;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: string;
  signature: string;
}

export class ArcumPaymaster {
  public dailySponsorshipLimitUsdg: number;
  public totalSponsoredTodayUsdg: number = 0;
  public sponsorshipEnabled: boolean = true;

  constructor(dailyLimitUsdg: number = 500) {
    this.dailySponsorshipLimitUsdg = dailyLimitUsdg;
  }

  public shouldSponsorUserOp(user: string, estGasCostUsdg: number): boolean {
    if (!this.sponsorshipEnabled) return false;
    if (this.totalSponsoredTodayUsdg + estGasCostUsdg > this.dailySponsorshipLimitUsdg) {
      return false; // Fallback to normal wallet gas payment
    }
    this.totalSponsoredTodayUsdg += estGasCostUsdg;
    return true;
  }

  public resetDailyLimit(): void {
    this.totalSponsoredTodayUsdg = 0;
  }
}
