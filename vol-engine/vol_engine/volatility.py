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
MAX_VOLATILITY_SHIFT_RATIO = 0.25  # 25% max volatility shift per update (VolOracle.sol reference)
MIN_UPDATE_INTERVAL_SECONDS = 300   # 5-minute minimum interval between updates


def validate_volatility_shift(prev_sigma_bps: int, new_sigma_bps: int, max_ratio: float = MAX_VOLATILITY_SHIFT_RATIO) -> int:
    """
    Enforces that volatility cannot shift by more than max_ratio (25%) in a single update,
    preventing oracle manipulation and protecting Writer Pool LPs (spec: VolOracle.sol).
    Clamps the new sigma if it exceeds the boundary.
    """
    if prev_sigma_bps <= 0:
        return max(MIN_SIGMA_BPS, min(MAX_SIGMA_BPS, new_sigma_bps))

    max_allowed = int(prev_sigma_bps * (1.0 + max_ratio))
    min_allowed = int(prev_sigma_bps * (1.0 - max_ratio))

    clamped = max(min_allowed, min(max_allowed, new_sigma_bps))
    return max(MIN_SIGMA_BPS, min(MAX_SIGMA_BPS, clamped))


def is_earnings_blackout(current_ts: int, earnings_schedule: List[int], blackout_window: int = 86400) -> bool:
    """
    Returns True if current timestamp is within the blackout window (default 24h) of an earnings release.
    """
    for release_ts in earnings_schedule:
        if abs(current_ts - release_ts) <= blackout_window:
            return True
    return False


class VolOracleGuard:
    """
    Stateful oracle guard tracking consecutive postings per stock.
    Enforces minimum update interval (300s) and 25% max shift boundary.
    """
    def __init__(self, min_interval: int = MIN_UPDATE_INTERVAL_SECONDS, max_shift: float = MAX_VOLATILITY_SHIFT_RATIO):
        self.min_interval = min_interval
        self.max_shift = max_shift
        self.last_postings: dict = {} # stock -> (sigma_bps, timestamp)

    def process_reading(self, stock: str, new_sigma_bps: int, timestamp: int) -> Tuple[int, bool]:
        """
        Processes a candidate volatility reading.
        Returns: (bounded_sigma_bps, allowed_to_post)
        """
        stock = stock.lower()
        if stock not in self.last_postings:
            bounded = max(MIN_SIGMA_BPS, min(MAX_SIGMA_BPS, new_sigma_bps))
            self.last_postings[stock] = (bounded, timestamp)
            return bounded, True

        prev_sigma, prev_ts = self.last_postings[stock]
        if timestamp - prev_ts < self.min_interval:
            # Cooldown active; cannot post
            return prev_sigma, False

        bounded = validate_volatility_shift(prev_sigma, new_sigma_bps, self.max_shift)
        self.last_postings[stock] = (bounded, timestamp)
        return bounded, True


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
