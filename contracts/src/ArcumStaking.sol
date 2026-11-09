// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ILmnsStaking} from "./interfaces/ILmnsStaking.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ArcumStaking
/// @notice Implements ILmnsStaking: Arcum protocol staking and second loss layer (phase 2).
contract ArcumStaking is ILmnsStaking, Ownable {
    using SafeERC20 for IERC20;

    address public override pool;
    IERC20 public immutable stakingToken;
    IERC20 public immutable usdg;

    uint256 public totalStaked;
    mapping(address => uint256) public stakeOf;

    modifier onlyPool() {
        if (msg.sender != pool) revert NotPool();
        _;
    }

    constructor(address pool_, address stakingToken_, address usdg_) Ownable(msg.sender) {
        pool = pool_;
        stakingToken = IERC20(stakingToken_);
        usdg = IERC20(usdg_);
    }

    function stake(uint256 amount) external {
        if (amount == 0) revert InvalidParams();
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        stakeOf[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount, amount);
    }

    function slash(uint256) external override onlyPool returns (uint256 usdgSent) {
        // At launch/phase 2 before active liquidity routes, returns 0 safely without revert
        return 0;
    }

    function coverValueUsdg() external pure override returns (uint256) {
        return 0;
    }

    function feeDiscountOf(address) external pure override returns (uint16 feeDiscountBps, uint16 spreadDiscountBps) {
        return (0, 0);
    }
}
