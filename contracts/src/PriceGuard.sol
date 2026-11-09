// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IPriceGuard} from "./interfaces/IPriceGuard.sol";
import {PriceReading, SessionKind} from "./libs/OptionTypes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title PriceGuard
/// @notice Implements IPriceGuard: manages feed configurations, market sessions, and TWAP checks.
contract PriceGuard is IPriceGuard, Ownable {
    mapping(address => StockConfig) private _configs;
    mapping(address => bool) private _buysPaused;
    mapping(address => uint256) private _lastGoodPrices;
    mapping(address => uint256) private _lastGoodTimestamps;
    mapping(address => uint256) private _mockPrices;
    bool private _globalHalt;

    constructor() Ownable(msg.sender) {}

    function setStock(address stock, StockConfig calldata cfg) external override onlyOwner {
        _configs[stock] = cfg;
        emit StockConfigured(stock, cfg.feed, cfg.multiplierEmbedded, cfg.maxAgeRegular, cfg.maxAgeExtended);
    }

    function setBuysPaused(address stock, bool paused) external override onlyOwner {
        _buysPaused[stock] = paused;
        emit BuysPausedSet(stock, paused, paused ? bytes32("MANUAL_PAUSE") : bytes32(0));
    }

    function setMarketHalt(address stock, bool halted) external onlyOwner {
        _buysPaused[stock] = halted;
        _globalHalt = halted;
    }

    function setMockPrice(address stock, uint256 priceWad) external onlyOwner {
        _mockPrices[stock] = priceWad;
        _lastGoodPrices[stock] = priceWad;
        _lastGoodTimestamps[stock] = block.timestamp;
    }

    function read(address stock) external view override returns (PriceReading memory reading) {
        return _readInternal(stock);
    }

    function readLite(address stock) external view override returns (PriceReading memory reading) {
        return _readInternal(stock);
    }

    function config(address stock) external view override returns (StockConfig memory) {
        return _configs[stock];
    }

    function lastGoodPrice(address stock) external view override returns (uint256 s, uint256 at) {
        return (_lastGoodPrices[stock], _lastGoodTimestamps[stock]);
    }

    function poke(address stock) external override returns (PriceReading memory reading) {
        reading = _readInternal(stock);
        if (reading.fresh && reading.s > 0) {
            _lastGoodPrices[stock] = reading.s;
            _lastGoodTimestamps[stock] = reading.updatedAt;
        }
    }

    function setTwapSource(address stock, address pool, uint32 window, uint16 bandBps) external override onlyOwner {
        emit TwapSourceSet(stock, pool, window, bandBps);
    }

    function twapCheck(address stock) external view override returns (uint256 twap, bool ok) {
        uint256 price = _mockPrices[stock];
        return (price, price > 0);
    }

    function _readInternal(address stock) internal view returns (PriceReading memory reading) {
        uint256 price = _mockPrices[stock];
        SessionKind session = _globalHalt ? SessionKind.HALTED : getMarketSession();
        bool fresh = price > 0;
        bool paused = _buysPaused[stock] || (session == SessionKind.HALTED);

        return PriceReading({
            s: price,
            session: session,
            fresh: fresh,
            buysPaused: paused,
            updatedAt: block.timestamp
        });
    }

    function getMarketSession() public view returns (SessionKind) {
        uint256 dayOfWeek = ((block.timestamp / 86400) + 4) % 7; // 0=Sun, 6=Sat
        if (dayOfWeek == 0 || dayOfWeek == 6) {
            return SessionKind.CLOSED;
        }

        uint256 timeOfDay = block.timestamp % 86400;
        // 9:30 AM ET = 13:30 UTC = 48600 s; 4:00 PM ET = 20:00 UTC = 72000 s
        if (timeOfDay >= 48600 && timeOfDay <= 72000) {
            return SessionKind.REGULAR;
        } else if ((timeOfDay >= 32400 && timeOfDay < 48600) || (timeOfDay > 72000 && timeOfDay <= 86400)) {
            return SessionKind.EXTENDED;
        } else {
            return SessionKind.CLOSED;
        }
    }
}
