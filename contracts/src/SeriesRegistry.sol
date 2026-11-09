// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ISeriesRegistry} from "./interfaces/ISeriesRegistry.sol";
import {Series, Speed} from "./libs/OptionTypes.sol";
import {OptionToken} from "./OptionToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SeriesRegistry
/// @notice Implements ISeriesRegistry: lists everlasting series, tracks epochs, norms, and OptionTokens.
contract SeriesRegistry is ISeriesRegistry, Ownable {
    uint256 constant WAD = 1e18;

    address public engine;
    uint128 public override relistNormThreshold = 1e15; // 0.001 WAD

    mapping(address => bool) public override allowedStock;
    mapping(bytes32 => Series) private _series;
    mapping(bytes32 => uint32) private _epochs;
    bytes32[] private _allSeriesIds;

    // (stock, isCall, strike, tauSeconds) => current epoch counter
    mapping(bytes32 => uint32) private _epochCounters;

    error OnlyEngine();

    modifier onlyEngine() {
        if (msg.sender != engine && msg.sender != owner()) revert OnlyEngine();
        _;
    }

    constructor() Ownable(msg.sender) {}

    function setEngine(address engine_) external onlyOwner {
        engine = engine_;
    }

    function setAllowedStock(address stock, bool allowed) external onlyOwner {
        allowedStock[stock] = allowed;
    }

    function setRelistNormThreshold(uint128 threshold) external onlyOwner {
        relistNormThreshold = threshold;
        emit RelistNormThresholdSet(threshold);
    }

    function idOfEpoch(
        address stock,
        bool isCall,
        uint128 strike,
        uint32 tauSeconds,
        uint32 epoch
    ) public pure override returns (bytes32) {
        return keccak256(abi.encode(stock, isCall, strike, tauSeconds, epoch));
    }

    function _keyOf(address stock, bool isCall, uint128 strike, uint32 tauSeconds) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(stock, isCall, strike, tauSeconds));
    }

    function currentEpoch(
        address stock,
        bool isCall,
        uint128 strike,
        uint32 tauSeconds
    ) public view override returns (uint32) {
        return _epochCounters[_keyOf(stock, isCall, strike, tauSeconds)];
    }

    function idOf(
        address stock,
        bool isCall,
        uint128 strike,
        uint32 tauSeconds
    ) external view override returns (bytes32) {
        uint32 epoch = currentEpoch(stock, isCall, strike, tauSeconds);
        return idOfEpoch(stock, isCall, strike, tauSeconds, epoch);
    }

    function listSeries(
        address stock,
        bool isCall,
        uint128 strike,
        uint32 tauSeconds
    ) external override onlyEngine returns (bytes32 id) {
        if (!allowedStock[stock]) revert StockNotAllowed(stock);
        if (strike == 0) revert StrikeInvalid(strike);

        bytes32 key = _keyOf(stock, isCall, strike, tauSeconds);
        uint32 epoch = _epochCounters[key];
        id = idOfEpoch(stock, isCall, strike, tauSeconds, epoch);

        if (_series[id].strike != 0) {
            // Relist next epoch
            epoch += 1;
            _epochCounters[key] = epoch;
            bytes32 previousId = id;
            id = idOfEpoch(stock, isCall, strike, tauSeconds, epoch);
            _series[previousId].archived = true;
            emit EpochListed(id, previousId, epoch);
        }

        Speed speed = tauSeconds <= 86400 ? Speed.DAILY : Speed.WEEKLY;
        string memory sym = isCall ? "UP" : "DOWN";
        OptionToken token = new OptionToken("Arcum Option", sym, id, engine);

        _series[id] = Series({
            stock: stock,
            isCall: isCall,
            speed: speed,
            tauSeconds: tauSeconds,
            strike: strike,
            token: address(token),
            norm: uint128(WAD),
            lastAccrual: uint64(block.timestamp),
            listedAt: uint64(block.timestamp),
            buyable: true,
            archived: false
        });

        _epochs[id] = epoch;
        _allSeriesIds.push(id);

        emit SeriesListed(id, stock, isCall, speed, strike, address(token));
    }

    function setBuyable(bytes32 id, bool buyable) external override onlyEngine {
        if (_series[id].strike == 0) revert SeriesUnknown(id);
        _series[id].buyable = buyable;
        emit SeriesBuyableSet(id, buyable);
    }

    function archive(bytes32 id) external override onlyEngine {
        if (_series[id].strike == 0) revert SeriesUnknown(id);
        _series[id].archived = true;
        _series[id].buyable = false;
        emit SeriesArchived(id);
    }

    function storeAccrual(bytes32 id, uint128 norm, uint64 lastAccrual) external override onlyEngine {
        if (_series[id].strike == 0) revert SeriesUnknown(id);
        _series[id].norm = norm;
        _series[id].lastAccrual = lastAccrual;
    }

    function seriesOf(bytes32 id) external view override returns (Series memory) {
        if (_series[id].strike == 0) revert SeriesUnknown(id);
        return _series[id];
    }

    function seriesCount() external view override returns (uint256) {
        return _allSeriesIds.length;
    }

    function seriesIdAt(uint256 index) external view override returns (bytes32) {
        return _allSeriesIds[index];
    }

    function epochOf(bytes32 id) external view override returns (uint32) {
        return _epochs[id];
    }
}
