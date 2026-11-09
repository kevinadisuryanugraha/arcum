// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IWriterVault, IVaultRegistry} from "./interfaces/IWriterVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title CoveredUpVault
/// @notice Specialized writer vault for short calls, fully collateralized by Stock Tokens (phase 2).
contract CoveredUpVault is IWriterVault, Ownable {
    using SafeERC20 for IERC20;

    address public override asset;
    address public override usdg;
    address public override stock;
    address public override registry;
    uint32 public override tauSeconds;
    uint256 public override EPOCH = 7 days;
    uint64 public override currentEpoch = 0;
    uint256 public override epochEndsAt;

    bool public override open = false; // Closed at launch

    uint256 public override collateral;
    uint256 public override fundingReceived;
    uint256 public override freeCollateral;
    uint256 public override debt;

    uint256 public totalShares;
    mapping(address => uint256) public sharesOf;
    mapping(address => uint256) public pendingDeposits;

    constructor(
        address stock_,
        address usdg_,
        address registry_,
        uint32 tauSeconds_
    ) Ownable(msg.sender) {
        asset = stock_;
        stock = stock_;
        usdg = usdg_;
        registry = registry_;
        tauSeconds = tauSeconds_;
        epochEndsAt = block.timestamp + EPOCH;
    }

    function isCallVault() external pure override returns (bool) {
        return true;
    }

    function band() external pure override returns (uint16 minMoneynessBps, uint16 maxMoneynessBps) {
        return (10000, 15000); // 100% to 150% moneyness
    }

    function setOpen(bool open_) external onlyOwner {
        open = open_;
        emit OpenSet(open_);
    }

    function deposit(uint256 assets) external override {
        if (!open) revert VaultClosed();
        if (assets == 0) revert BelowMinimum();

        IERC20(asset).safeTransferFrom(msg.sender, address(this), assets);
        pendingDeposits[msg.sender] += assets;
        emit Deposited(msg.sender, currentEpoch, assets);
    }

    function requestWithdraw(uint256 shares) external override {
        if (shares == 0 || shares > sharesOf[msg.sender]) revert InvalidParams();
        sharesOf[msg.sender] -= shares;
        emit WithdrawRequested(msg.sender, currentEpoch, shares);
    }

    function roll() external override {
        if (block.timestamp < epochEndsAt) revert EpochNotOver(epochEndsAt);
        currentEpoch += 1;
        epochEndsAt = block.timestamp + EPOCH;
        emit EpochRolled(currentEpoch, 0, 1e18, 0, 0, 0, 0);
    }

    function claim() external override returns (uint256 shares, uint256 collateralOut, uint256 usdgOut) {
        uint256 pending = pendingDeposits[msg.sender];
        if (pending == 0) revert NothingToClaim();
        pendingDeposits[msg.sender] = 0;
        shares = pending;
        sharesOf[msg.sender] += shares;
        totalShares += shares;
        collateral += pending;
        freeCollateral += pending;
        emit Claimed(msg.sender, shares, 0, 0);
    }

    function nav() external view override returns (uint256) {
        return collateral * 1e18;
    }

    function navPerShare() external view override returns (uint256) {
        return totalShares > 0 ? (collateral * 1e18) / totalShares : 1e18;
    }

    function creditFunding(uint256 amount) external override {
        fundingReceived += amount;
        emit FundingCredited(amount);
    }

    function payLoss(address to, uint256 amount) external override returns (uint256 paidNow) {
        uint256 avail = IERC20(asset).balanceOf(address(this));
        paidNow = amount < avail ? amount : avail;
        if (paidNow > 0) IERC20(asset).safeTransfer(to, paidNow);
        emit LossPaid(to, paidNow, paidNow > 0);
    }
}
