import { describe, expect, it } from "bun:test";
import { ArcumKeeper } from "../src/keeper/keeper";

describe("Arcum Keeper Daemon", () => {
  it("triggers funding accrual on elapsed time interval", () => {
    const keeper = new ArcumKeeper();

    keeper.registerSeries({
      id: '0xSERIES_1',
      stock: 'NVDA',
      isCall: true,
      strike: 145,
      tauSeconds: 86400,
      norm: 1.0,
      lastAccrual: 1000,
      buyable: true,
    });

    // Advance time by 3600 seconds (1 hour)
    const updated = keeper.checkAndAccrue(1000 + 3600, 3600);
    expect(updated.length).toBe(1);
    expect(updated[0]).toBe('0xSERIES_1');
    expect(keeper.accruedCount).toBe(1);

    // If no time elapsed, no accrual needed
    const noUpdate = keeper.checkAndAccrue(1000 + 3600, 3600);
    expect(noUpdate.length).toBe(0);
  });

  it("holds queued sells during market halt and fills when resumed", () => {
    const keeper = new ArcumKeeper();

    keeper.registerQueuedTicket({
      ticketId: 1,
      seriesId: '0xSERIES_1',
      seller: '0xUserA',
      tokens: 10,
      queuedAt: 1000,
    });

    // When market is halted, zero tickets filled
    const duringHalt = keeper.processQueuedSells(true);
    expect(duringHalt.length).toBe(0);
    expect(keeper.filledTicketCount).toBe(0);

    // When market resumes (halt cleared), ticket is filled
    const onResume = keeper.processQueuedSells(false);
    expect(onResume.length).toBe(1);
    expect(onResume[0]).toBe(1);
    expect(keeper.filledTicketCount).toBe(1);
  });
});
