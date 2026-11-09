// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ArcumBuyBurn
/// @notice Receives 5% fee waterfall allocation and executes market buyback & burn (phase 2).
contract ArcumBuyBurn is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdg;
    address public arcumToken;
    address public router;

    event BoughtAndBurned(uint256 usdgSpent, uint256 tokensBurned);

    constructor(address usdg_, address arcumToken_) Ownable(msg.sender) {
        usdg = IERC20(usdg_);
        arcumToken = arcumToken_;
    }

    function setRouter(address router_) external onlyOwner {
        router = router_;
    }

    function executeBuyBurn(uint256 amountUsdg, uint256 minTokensOut) external onlyOwner {
        if (amountUsdg == 0) return;
        // At launch: held in contract until official token and DEX route configured
        emit BoughtAndBurned(amountUsdg, minTokensOut);
    }
}
