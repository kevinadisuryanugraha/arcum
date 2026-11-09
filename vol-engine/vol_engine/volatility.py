"""
Arcum Volatility Engine — Python Reference Implementation
Computes realized volatility, strike skew adjustment, and closed-form everlasting option pricing.
"""

import math
from typing import List, Tuple

SECONDS_PER_YEAR = 31536000
TRADING_DAYS_PER_YEAR = 252
MIN_SIGMA_BPS = 2000  # 20% minimum volatility floor
MAX_SIGMA_BPS = 20000 # 200% maximum volatility cap


def calculate_realized_volatility(prices: List[float]) -> int:
    """
    Computes annualized realized volatility from historical close prices in basis points.
    sigma = std_dev(log_returns) * sqrt(252)
    """
    if len(prices) < 2:
        return 5000  # Default 50% IV fallback

    log_returns = []
    for i in range(1, len(prices)):
        if prices[i - 1] <= 0 or prices[i] <= 0:
            continue
        log_returns.append(math.log(prices[i] / prices[i - 1]))

    if not log_returns:
        return 5000

    n = len(log_returns)
    mean_ret = sum(log_returns) / n
    variance = sum((r - mean_ret) ** 2 for r in log_returns) / (n - 1 if n > 1 else 1)
    daily_vol = math.sqrt(variance)
    annualized_vol = daily_vol * math.sqrt(TRADING_DAYS_PER_YEAR)

    sigma_bps = int(annualized_vol * 10000)
    # Apply protocol bounds
    return max(MIN_SIGMA_BPS, min(MAX_SIGMA_BPS, sigma_bps))


def calculate_alpha(sigma_bps: int, tau_seconds: int) -> float:
    """
    Computes characteristic parameter alpha:
    alpha = (1 + sqrt(1 + 8 / (sigma^2 * tau))) / 2
    """
    if sigma_bps <= 0 or tau_seconds <= 0:
        raise ValueError("sigma_bps and tau_seconds must be positive")

    sigma = sigma_bps / 10000.0
    tau_years = tau_seconds / float(SECONDS_PER_YEAR)

    denom = (sigma ** 2) * tau_years
    term = 8.0 / denom
    disc = 1.0 + term
    return (1.0 + math.sqrt(disc)) / 2.0


def price_everlasting(
    spot: float,
    strike: float,
    sigma_bps: int,
    tau_seconds: int,
    is_call: bool
) -> float:
    """
    Solves closed-form price of an everlasting option in Python.
    """
    if spot <= 0 or strike <= 0:
        raise ValueError("Spot and strike must be positive")

    alpha = calculate_alpha(sigma_bps, tau_seconds)
    denom = 2.0 * alpha - 1.0

    if is_call:
        if spot <= strike:
            return (strike / denom) * ((spot / strike) ** alpha)
        else:
            return (spot - strike) + (strike / denom) * ((strike / spot) ** (alpha - 1.0))
    else:
        if spot >= strike:
            return (strike / denom) * ((strike / spot) ** (alpha - 1.0))
        else:
            return (strike - spot) + (strike / denom) * ((spot / strike) ** alpha)
