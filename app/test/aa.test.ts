import { describe, expect, it } from "bun:test";
import { ArcumPaymaster } from "../src/aa/paymaster";

describe("Arcum ERC-4337 Account Abstraction & Paymaster", () => {
  it("sponsors UserOperations within daily budget", () => {
    const paymaster = new ArcumPaymaster(100); // 100 USDG daily limit

    const canSponsor1 = paymaster.shouldSponsorUserOp("0xUser1", 20);
    expect(canSponsor1).toBe(true);
    expect(paymaster.totalSponsoredTodayUsdg).toBe(20);

    const canSponsor2 = paymaster.shouldSponsorUserOp("0xUser2", 70);
    expect(canSponsor2).toBe(true);
    expect(paymaster.totalSponsoredTodayUsdg).toBe(90);

    // Over budget request must fallback (return false)
    const canSponsor3 = paymaster.shouldSponsorUserOp("0xUser3", 25); // 90 + 25 = 115 > 100
    expect(canSponsor3).toBe(false);
  });
});
