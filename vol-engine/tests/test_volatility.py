"""
Unit tests for Arcum Volatility Engine.
"""

import pytest
from vol_engine.volatility import (
    calculate_realized_volatility,
    calculate_alpha,
    price_everlasting,
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
