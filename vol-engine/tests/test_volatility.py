"""
Unit tests for Arcum Volatility Engine.
"""

import pytest
from vol_engine.volatility import (
    calculate_realized_volatility,
    calculate_alpha,
    price_everlasting,
    validate_volatility_shift,
    is_earnings_blackout,
    VolOracleGuard,
    MIN_SIGMA_BPS,
    MAX_SIGMA_BPS
)


def test_realized_volatility_calculation():
    # Simulated price series
    prices = [100.0, 102.0, 101.0, 103.5, 102.8, 105.0, 104.2]
    sigma_bps = calculate_realized_volatility(prices)

    assert MIN_SIGMA_BPS <= sigma_bps <= MAX_SIGMA_BPS
    assert isinstance(sigma_bps, int)


def test_alpha_symmetry_and_scaling():
    sigma_bps = 5000  # 50%
    daily_tau = 86400
    weekly_tau = 604800

    alpha_daily = calculate_alpha(sigma_bps, daily_tau)
    alpha_weekly = calculate_alpha(sigma_bps, weekly_tau)

    assert alpha_daily > 1.0
    assert alpha_weekly > 1.0
    assert alpha_daily > alpha_weekly


def test_python_call_put_parity():
    spot = 120.0
    strike = 100.0
    sigma_bps = 5000
    tau = 86400

    call_price = price_everlasting(spot, strike, sigma_bps, tau, is_call=True)
    put_price = price_everlasting(spot, strike, sigma_bps, tau, is_call=False)

    # Parity check: Call - Put = S - K
    diff = call_price - put_price
    expected = spot - strike
    assert abs(diff - expected) < 1e-4


def test_atm_call_put_equality():
    spot = 100.0
    strike = 100.0
    sigma_bps = 5000
    tau = 86400

    call_price = price_everlasting(spot, strike, sigma_bps, tau, is_call=True)
    put_price = price_everlasting(spot, strike, sigma_bps, tau, is_call=False)

    assert abs(call_price - put_price) < 1e-6
    assert call_price > 0


def test_volatility_shift_bounds():
    # 25% max shift: from 5000 bps, max is 6250, min is 3750
    prev = 5000
    # Attempt 50% jump to 7500 -> should be clamped to 6250
    assert validate_volatility_shift(prev, 7500) == 6250
    # Attempt 50% drop to 2500 -> should be clamped to 3750
    assert validate_volatility_shift(prev, 2500) == 3750
    # Moderate 10% change to 5500 -> passes through directly
    assert validate_volatility_shift(prev, 5500) == 5500


def test_earnings_blackout_window():
    earnings_ts = 1700000000
    # 12 hours before earnings -> in blackout
    assert is_earnings_blackout(earnings_ts - 43200, [earnings_ts]) is True
    # 48 hours before earnings -> outside blackout
    assert is_earnings_blackout(earnings_ts - 172800, [earnings_ts]) is False


def test_vol_oracle_guard_cooldown_and_shift():
    guard = VolOracleGuard(min_interval=300, max_shift=0.25)
    stock = "0xNVDA"

    # Initial posting
    sigma1, allowed1 = guard.process_reading(stock, 5000, 1000)
    assert allowed1 is True
    assert sigma1 == 5000

    # Attempt posting 100s later (under 300s cooldown) -> rejected
    sigma2, allowed2 = guard.process_reading(stock, 5200, 1100)
    assert allowed2 is False
    assert sigma2 == 5000

    # Posting 350s later with excessive jump (8000 bps) -> allowed but clamped to 6250
    sigma3, allowed3 = guard.process_reading(stock, 8000, 1350)
    assert allowed3 is True
    assert sigma3 == 6250
