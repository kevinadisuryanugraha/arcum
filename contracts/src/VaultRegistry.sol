// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IVaultRegistry, IWriterVault} from "./interfaces/IWriterVault.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title VaultRegistry
/// @notice Coverage book between WriterPool and specialized writer vaults (phase 2).
contract VaultRegistry is IVaultRegistry, Ownable {
    using SafeERC20 for IERC20;

    address public override pool;
    mapping(address => bool) public isVault;
    address[] public vaults;

    modifier onlyPool() {
        if (msg.sender != pool) revert NotPool();
        _;
    }

    constructor(address pool_) Ownable(msg.sender) {
        pool = pool_;
    }

    function addVault(address vault) external onlyOwner {
        if (vault == address(0)) revert InvalidParams();
        isVault[vault] = true;
        vaults.push(vault);
        emit VaultAdded(vault);
    }

    function shareOf(bytes32, uint256, uint256) external pure override returns (uint256) {
        return 0; // Unwired / 0 share at launch
    }

    function routeFunding(bytes32, uint256) external override onlyPool {
        // Routes pro rata when vaults active
    }

    function onBuyback(bytes32, uint256, uint256, uint256) external override onlyPool {
        // Settles intrinsic value on buybacks
    }

    function releaseFraction(uint256) external pure override returns (uint256 lossCollateral) {
        return 0;
    }

    function debtPaid(uint256) external override onlyPool {}

    function lockedOf(address) external pure override returns (uint256) {
        return 0;
    }

    function unrealizedLossOf(address, uint256) external pure override returns (uint256) {
        return 0;
    }

    function coveredTokens(bytes32) external pure override returns (uint256) {
        return 0;
    }

    function sliceOf(address, bytes32) external pure override returns (uint256 tokens) {
        return 0;
    }

    function seriesOfVault(address) external pure override returns (bytes32[] memory) {
        return new bytes32[](0);
    }
}
