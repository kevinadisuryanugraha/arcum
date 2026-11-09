import { describe, expect, it } from "bun:test";
import { ArcumIndexer } from "../src/indexer/indexer";

describe("Arcum Bun Event Indexer", () => {
  it("initializes with starting block cursor", () => {
    const indexer = new ArcumIndexer(4663, 100n);
    const cursor = indexer.getCursor();
    expect(cursor.chainId).toBe(4663);
    expect(cursor.lastBlockNumber).toBe(100n);
  });

  it("ingests blocks and deduplicates events", () => {
    const indexer = new ArcumIndexer(4663, 0n);

    const block101Events = [
      {
        eventName: 'Bought' as const,
        seriesId: '0xNVDA_UP_145',
        blockNumber: 101n,
        blockHash: '0xhash101',
        transactionHash: '0xtx1',
        logIndex: 0,
        data: { units: 10, costUsdg: 15 },
        timestamp: 1700000000,
      },
    ];

    indexer.ingestBlock(101n, '0xhash101', '0xhash100', block101Events);
    expect(indexer.getCursor().lastBlockNumber).toBe(101n);
    expect(indexer.getEvents().length).toBe(1);

    // Duplicate ingestion must not add duplicate events
    indexer.ingestBlock(101n, '0xhash101', '0xhash100', block101Events);
    expect(indexer.getEvents().length).toBe(1);
  });

  it("handles chain reorganization rollback cleanly", () => {
    const indexer = new ArcumIndexer(4663, 0n);

    indexer.ingestBlock(101n, '0xhash101_A', '0xhash100', [
      {
        eventName: 'Bought' as const,
        seriesId: '0xNVDA_UP_145',
        blockNumber: 101n,
        blockHash: '0xhash101_A',
        transactionHash: '0xtx_forkA',
        logIndex: 0,
        data: {},
        timestamp: 1700000000,
      }
    ]);

    expect(indexer.getEvents().length).toBe(1);

    // Rollback to block 100
    indexer.rollback(100n);
    expect(indexer.getCursor().lastBlockNumber).toBe(100n);
    expect(indexer.getEvents().length).toBe(0);
  });
});
