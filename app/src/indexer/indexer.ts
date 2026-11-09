/**
 * Arcum Event Indexer (Bun/TypeScript)
 * Ingests on-chain events from ArcumEngine, SeriesRegistry, and WriterPool.
 * Maintains persistent block cursors and provides deterministic replay.
 */

export interface BlockCursor {
  chainId: number;
  lastBlockNumber: bigint;
  lastBlockHash: string;
  updatedAt: number;
}

export interface IndexedEvent {
  id: string;
  eventName: 'Bought' | 'Sold' | 'ShieldBought' | 'SellQueued' | 'QueuedSellFilled' | 'SeriesListed';
  seriesId: string;
  blockNumber: bigint;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  data: Record<string, any>;
  timestamp: number;
}

export class ArcumIndexer {
  private cursor: BlockCursor;
  private eventStore: IndexedEvent[] = [];
  private reorgHistory: Map<bigint, string> = new Map();

  constructor(chainId: number = 4663, startBlock: bigint = 0n) {
    this.cursor = {
      chainId,
      lastBlockNumber: startBlock,
      lastBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      updatedAt: Date.now(),
    };
  }

  public getCursor(): BlockCursor {
    return { ...this.cursor };
  }

  public getEvents(eventName?: string): IndexedEvent[] {
    if (!eventName) return [...this.eventStore];
    return this.eventStore.filter((e) => e.eventName === eventName);
  }

  /**
   * Processes a new block batch of events.
   * If a reorg is detected (parent hash mismatch), triggers deterministic rollback.
   */
  public ingestBlock(
    blockNumber: bigint,
    blockHash: string,
    parentHash: string,
    rawEvents: Omit<IndexedEvent, 'id'>[]
  ): boolean {
    // Reorg check: if this block's parent doesn't match our recorded blockHash for blockNumber - 1
    if (this.cursor.lastBlockNumber > 0n && blockNumber === this.cursor.lastBlockNumber + 1n) {
      if (this.cursor.lastBlockHash !== parentHash && this.cursor.lastBlockHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        this.rollback(blockNumber - 1n);
      }
    }

    // Record block hash in reorg history
    this.reorgHistory.set(blockNumber, blockHash);

    // Ingest events
    for (const ev of rawEvents) {
      const eventId = `${ev.transactionHash}-${ev.logIndex}`;
      // Prevent duplicates
      if (!this.eventStore.some((e) => e.id === eventId)) {
        this.eventStore.push({
          ...ev,
          id: eventId,
        });
      }
    }

    // Update cursor
    this.cursor.lastBlockNumber = blockNumber;
    this.cursor.lastBlockHash = blockHash;
    this.cursor.updatedAt = Date.now();

    return true;
  }

  /**
   * Rolls back indexed state to safeBlock in event of blockchain reorganization
   */
  public rollback(safeBlock: bigint): void {
    this.eventStore = this.eventStore.filter((e) => e.blockNumber <= safeBlock);
    const safeHash = this.reorgHistory.get(safeBlock) || '0x0000000000000000000000000000000000000000000000000000000000000000';
    this.cursor.lastBlockNumber = safeBlock;
    this.cursor.lastBlockHash = safeHash;
    this.cursor.updatedAt = Date.now();
  }
}
