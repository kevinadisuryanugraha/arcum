// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IFeeRouter} from "./interfaces/IFeeRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FeeRouter
/// @notice Distributes protocol fees according to the brief's waterfall:
///         80% Workers (60% Writer Pool, 20% Keeper, 20% Hedger)
///         10% Treasury
///         5% Stakers (Held until activated)
///         5% Buy/Burn (Held until activated)
contract FeeRouter is IFeeRouter, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDG;
    address public pool;
    address public keeper;
    address public hedger;
    address public treasury;

    uint16 public override protocolFeeBps = 1000; // 10%
    uint256 public override nextDistributionAt;
    uint256 public override heldStakers;
    uint256 public override heldBurn;

    constructor(
        address usdg_,
        address pool_,
        address keeper_,
        address hedger_,
        address treasury_
    ) Ownable(msg.sender) {
        USDG = IERC20(usdg_);
        pool = pool_;
        keeper = keeper_;
        hedger = hedger_;
        treasury = treasury_;
        nextDistributionAt = block.timestamp;
    }

    function distributable() public view override returns (uint256) {
        uint256 bal = USDG.balanceOf(address(this));
        uint256 totalHeld = heldStakers + heldBurn;
        return bal > totalHeld ? bal - totalHeld : 0;
    }

    function distribute() external override returns (uint256 amount) {
        amount = distributable();
        if (amount == 0) return 0;

        nextDistributionAt = block.timestamp + 7 days;

        // 80% Workers = 48% Pool, 16% Keeper, 16% Hedger
        uint256 poolAmount = (amount * 48) / 100;
        uint256 keeperAmount = (amount * 16) / 100;
        uint256 hedgerAmount = (amount * 16) / 100;
        // 10% Treasury
        uint256 treasuryAmount = (amount * 10) / 100;
        // 5% Stakers, 5% Buy/Burn
        uint256 stakersAmount = (amount * 5) / 100;
        uint256 burnAmount = amount - (poolAmount + keeperAmount + hedgerAmount + treasuryAmount + stakersAmount);

        heldStakers += stakersAmount;
        heldBurn += burnAmount;

        if (poolAmount > 0 && pool != address(0)) USDG.safeTransfer(pool, poolAmount);
        if (keeperAmount > 0 && keeper != address(0)) USDG.safeTransfer(keeper, keeperAmount);
        if (hedgerAmount > 0 && hedger != address(0)) USDG.safeTransfer(hedger, hedgerAmount);
        if (treasuryAmount > 0 && treasury != address(0)) USDG.safeTransfer(treasury, treasuryAmount);

        emit Distributed(amount, poolAmount, keeperAmount, hedgerAmount, treasuryAmount, stakersAmount, burnAmount);
    }
}
