// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {UniswapV3TwapReference, IUniswapV3FactoryLike, IUniswapV3PoolLike} from "../src/UniswapV3TwapReference.sol";

contract MockUniswapPool is IUniswapV3PoolLike {
    address public immutable token0Address;
    int56 public deltaTick;
    int24 public currentTick;

    constructor(address t0) {
        token0Address = t0;
        deltaTick = 0;
        currentTick = 0;
    }

    function setTick(int24 tick_) external {
        currentTick = tick_;
    }

    function setDelta(int56 delta_) external {
        deltaTick = delta_;
    }

    function token0() external view override returns (address) {
        return token0Address;
    }

    function observe(uint32[] calldata secondsAgos)
        external
        view
        override
        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidity)
    {
        tickCumulatives = new int56[](2);
        tickCumulatives[0] = 0;
        tickCumulatives[1] = deltaTick;
        secondsPerLiquidity = new uint160[](2);
    }

    function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 obsIndex, uint16 obsCard, uint16 obsCardNext, uint8 feeProt, bool unlocked) {
        return (0, currentTick, 0, 0, 0, 0, true);
    }
}

contract MockUniswapFactory is IUniswapV3FactoryLike {
    mapping(address => mapping(address => mapping(uint24 => address))) public pools;

    function setPool(address t0, address t1, uint24 fee, address pool) external {
        pools[t0][t1][fee] = pool;
        pools[t1][t0][fee] = pool;
    }

    function getPool(address tokenA, address tokenB, uint24 fee) external view override returns (address) {
        return pools[tokenA][tokenB][fee];
    }
}

contract UniswapV3TwapReferenceTest is Test {
    UniswapV3TwapReference public twap;
    MockUniswapFactory public factory;
    MockUniswapPool public pool;

    address public stock = address(0x1111);
    address public usdg = address(0x2222);
    uint32 public window = 1800; // 30 minutes

    function setUp() public {
        factory = new MockUniswapFactory();
        pool = new MockUniswapPool(stock);
        factory.setPool(stock, usdg, 3000, address(pool));

        twap = new UniswapV3TwapReference(IUniswapV3FactoryLike(address(factory)), usdg, window);
    }

    function testTickZeroIsOneToOne() public view {
        uint256 ratio = twap.priceX128AtTick(0);
        uint256 Q128 = 1 << 128;
        assertEq(ratio, Q128, "Tick 0 must equal 1.0 in Q128");
    }

    function testTickSymmetry() public view {
        int24 tick = 1000;
        uint256 rPos = twap.priceX128AtTick(tick);
        uint256 rNeg = twap.priceX128AtTick(-tick);
        uint256 Q128 = 1 << 128;

        // rPos * rNeg should approximately equal Q128^2
        uint256 product = (rPos * rNeg) >> 128;
        // Allowance within 1 ppm
        assertApproxEqRel(product, Q128, 1e12, "Reciprocal ticks must yield 1.0 product");
    }

    function testReferencePriceCalculation() public {
        // At tick 0, raw ratio is 1 (1 token1 wei per 1 token0 wei) -> 1 * 1e30 = 1e30
        pool.setDelta(0);
        uint256 refPrice = twap.referencePrice(stock, 3000);
        assertEq(refPrice, 1e30, "Tick 0 mean price must be 1e30 (RAW_TO_WAD)");
    }

    function testSpotPriceCalculation() public {
        pool.setTick(0);
        uint256 spot = twap.spotPrice(stock, 3000);
        assertEq(spot, 1e30, "Tick 0 spot price must be 1e30 (RAW_TO_WAD)");
    }
}
