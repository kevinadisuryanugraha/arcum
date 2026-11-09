/**
 * Arcum Keeper Automation Daemon (Bun/TypeScript)
 * Periodically accrues series funding norm, checks epoch relisting,
 * and fulfills queued sells once market resumes from HALTED session.
 */

export interface SeriesState {
  id: string;
  stock: string;
  isCall: boolean;
  strike: number;
  tauSeconds: number;
  norm: number;
  lastAccrual: number;
  buyable: boolean;
}

export interface QueuedSellTicket {
  ticketId: number;
  seriesId: string;
  seller: string;
  tokens: number;
  queuedAt: number;
}

export class ArcumKeeper {
  private seriesList: Map<string, SeriesState> = new Map();
  private queuedTickets: Map<number, QueuedSellTicket> = new Map();
  public accruedCount: number = 0;
  public filledTicketCount: number = 0;

  public registerSeries(series: SeriesState): void {
    this.seriesList.set(series.id, { ...series });
  }

  public registerQueuedTicket(ticket: QueuedSellTicket): void {
    this.queuedTickets.set(ticket.ticketId, { ...ticket });
  }

  /**
   * Scans all series and identifies those requiring funding accrual
   */
  public checkAndAccrue(currentTime: number, accrualIntervalSeconds: number = 3600): string[] {
    const updatedSeriesIds: string[] = [];

    for (const [id, s] of this.seriesList.entries()) {
      const elapsed = currentTime - s.lastAccrual;
      if (elapsed >= accrualIntervalSeconds) {
        // Calculate decay
        const ratePerSec = 0.5 / s.tauSeconds; // Time value decay rate
        const decayFactor = Math.exp(-ratePerSec * elapsed);
        s.norm = s.norm * decayFactor;
        s.lastAccrual = currentTime;
        this.accruedCount++;
        updatedSeriesIds.push(id);
      }
    }

    return updatedSeriesIds;
  }

  /**
   * Checks if market has resumed to fill queued sells
   */
  public processQueuedSells(isMarketHalted: boolean): number[] {
    if (isMarketHalted) {
      return []; // Cannot fill while market remains halted
    }

    const filled: number[] = [];
    for (const ticketId of this.queuedTickets.keys()) {
      this.queuedTickets.delete(ticketId);
      this.filledTicketCount++;
      filled.push(ticketId);
    }

    return filled;
  }
}
