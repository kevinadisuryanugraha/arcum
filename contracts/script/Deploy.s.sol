// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDG} from "../test/ArcumEngine.t.sol";
import {PriceGuard} from "../src/PriceGuard.sol";
import {SeriesRegistry} from "../src/SeriesRegistry.sol";
import {ArcumEngine} from "../src/ArcumEngine.sol";
import {WriterPool} from "../src/WriterPool.sol";
import {Reserve} from "../src/Reserve.sol";
import {FeeRouter} from "../src/FeeRouter.sol";
import {AgentRouter} from "../src/AgentRouter.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IOptionEngine} from "../src/interfaces/IOptionEngine.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployArcum is Script {
    address constant DEMO_USER = 0x71c8407d822a4E02b8b9829a78f9C762C2A0a49b;
    address constant NVDA = 0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC;
    address constant TSLA = 0x322F0929c4625eD5bAd873c95208D54E1c003b2d;
    address constant SPY  = 0x117cc2133c37B721F49dE2A7a74833232B3B4C0C;
    address constant QQQ  = 0xD5f3879160bc7c32ebb4dC785F8a4F505888de68;
    address constant AAPL = 0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9;

    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80) // Anvil default account 0
        );

        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deploying Arcum Protocol from:", deployer);

        // 1. Deploy USDG
        MockUSDG usdg = new MockUSDG();
        console.log("MockUSDG deployed at:", address(usdg));

        // 2. Deploy PriceGuard & configure prices
        PriceGuard priceGuard = new PriceGuard();
        priceGuard.setMockPrice(NVDA, 142500000000000000000); // $142.50
        priceGuard.setMockPrice(TSLA, 248800000000000000000); // $248.80
        priceGuard.setMockPrice(SPY,  585200000000000000000); // $585.20
        priceGuard.setMockPrice(QQQ,  498400000000000000000); // $498.40
        priceGuard.setMockPrice(AAPL, 226750000000000000000); // $226.75
        console.log("PriceGuard deployed at:", address(priceGuard));

        // 3. Deploy SeriesRegistry
        SeriesRegistry registry = new SeriesRegistry();
        registry.setAllowedStock(NVDA, true);
        registry.setAllowedStock(TSLA, true);
        registry.setAllowedStock(SPY, true);
        registry.setAllowedStock(QQQ, true);
        registry.setAllowedStock(AAPL, true);
        console.log("SeriesRegistry deployed at:", address(registry));

        // 4. Deploy WriterPool implementation & Proxy
        WriterPool poolImpl = new WriterPool(72 hours);
        bytes memory poolInit = abi.encodeWithSelector(
            WriterPool.initialize.selector,
            deployer,
            usdg,
            IOptionEngine(address(0)),
            priceGuard
        );
        ERC1967Proxy poolProxy = new ERC1967Proxy(address(poolImpl), poolInit);
        WriterPool pool = WriterPool(address(poolProxy));
        pool.setPublicDeposits(true);
        console.log("WriterPool Proxy deployed at:", address(pool));

        // 5. Deploy Engine
        ArcumEngine engine = new ArcumEngine(address(registry), address(priceGuard), address(usdg), address(pool));
        registry.setEngine(address(engine));
        console.log("ArcumEngine deployed at:", address(engine));

        // 6. Deploy Reserve & FeeRouter
        Reserve reserve = new Reserve(deployer, IERC20(address(usdg)), address(pool));
        FeeRouter feeRouter = new FeeRouter(address(usdg), address(pool), deployer, deployer, deployer);
        console.log("Reserve deployed at:", address(reserve));
        console.log("FeeRouter deployed at:", address(feeRouter));

        // 7. Deploy AgentRouter
        AgentRouter agentRouter = new AgentRouter(address(engine));
        console.log("AgentRouter deployed at:", address(agentRouter));

        // 8. List launch series
        registry.listSeries(NVDA, true, 140 * 1e18, 86400); // NVDA Up $140 Daily
        registry.listSeries(NVDA, true, 145 * 1e18, 86400); // NVDA Up $145 Daily
        registry.listSeries(NVDA, false, 137 * 1e18, 604800); // NVDA Down $137 Weekly
        registry.listSeries(TSLA, true, 250 * 1e18, 86400); // TSLA Up $250 Daily

        // 9. Fund Demo User & Writer Pool
        usdg.mint(DEMO_USER, 50000 * 1e6); // 50,000 USDG to demo user
        usdg.mint(address(pool), 1000000 * 1e6); // 1,000,000 USDG in Writer Pool

        vm.stopBroadcast();
        console.log("Arcum deployment completed successfully!");
    }
}
