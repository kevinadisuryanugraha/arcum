"""
Test suite for EIP-712 Volatility Signer.
"""

import pytest
from vol_engine.signer import VolatilitySigner


def test_eip712_signing_and_recovery():
    # Deterministic test key
    test_key = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
    oracle_contract = "0x1111111111111111111111111111111111111111"
    stock = "0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC" # NVDA

    signer = VolatilitySigner(test_key, oracle_contract, chain_id=4663)
    expected_address = signer.account.address

    sigma_bps = 5200 # 52%
    skew_k = 145
    nonce = 1
    expires_at = 1800000000

    sig_hex = signer.sign_vol_reading(stock, sigma_bps, skew_k, nonce, expires_at)
    assert sig_hex.startswith("0x") or len(sig_hex) == 130 or len(sig_hex) == 132

    # Verify recovery
    data = signer.build_eip712_data(stock, sigma_bps, skew_k, nonce, expires_at)
    recovered = VolatilitySigner.recover_signer(data, sig_hex)

    assert recovered.lower() == expected_address.lower()
