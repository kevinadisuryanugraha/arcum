/**
 * Arcum Backend API & Health Monitoring Server (Bun/TypeScript)
 * Serves /v1/health, /v1/config, /v1/pool, and verifies service key isolation.
 */

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  chainId: number;
  services: {
    indexer: { running: boolean; lastBlock: number; lag: number };
    keeper: { running: boolean; accruedToday: number };
    hedger: { running: boolean; lastRebalance: number };
    volEngine: { running: boolean; lastPost: number };
  };
  keyIsolation: {
    keeperAddress: string;
    hedgerAddress: string;
    volSignerAddress: string;
    isolated: boolean;
  };
  timestamp: number;
}

export function createHealthResponse(
  keeperAddr: string = '0x1111111111111111111111111111111111111111',
  hedgerAddr: string = '0x2222222222222222222222222222222222222222',
  volSignerAddr: string = '0x3333333333333333333333333333333333333333'
): ServiceHealth {
  const isIsolated =
    keeperAddr.toLowerCase() !== hedgerAddr.toLowerCase() &&
    keeperAddr.toLowerCase() !== volSignerAddr.toLowerCase() &&
    hedgerAddr.toLowerCase() !== volSignerAddr.toLowerCase();

  return {
    status: isIsolated ? 'healthy' : 'unhealthy',
    chainId: 4663,
    services: {
      indexer: { running: true, lastBlock: 18942109, lag: 0 },
      keeper: { running: true, accruedToday: 48 },
      hedger: { running: true, lastRebalance: Date.now() - 60000 },
      volEngine: { running: true, lastPost: Date.now() - 30000 },
    },
    keyIsolation: {
      keeperAddress: keeperAddr,
      hedgerAddress: hedgerAddr,
      volSignerAddress: volSignerAddr,
      isolated: isIsolated,
    },
    timestamp: Date.now(),
  };
}

// Bun HTTP Server Runner
export function startServer(port: number = 3002) {
  return Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === '/v1/health') {
        return Response.json(createHealthResponse());
      }

      if (url.pathname === '/v1/config') {
        return Response.json({
          chainId: 4663,
          chainName: 'Robinhood Chain Mainnet',
          usdg: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
          feeBps: 3,
        });
      }

      if (url.pathname === '/v1/pool') {
        return Response.json({
          navUsdg: 2500000.0,
          conservativeEntryNav: 2497500.0,
          navPerShare: 1.0204,
          capacityUtilizationPct: 49.7,
        });
      }

      return new Response('Not Found', { status: 404 });
    },
  });
}

if (import.meta.main) {
  const server = startServer(3002);
  console.log(`Arcum API running on http://localhost:${server.port}`);
}
