"""
EIP-712 Volatility Posting Signer for Arcum Protocol on Robinhood Chain (ID 4663).
"""

from typing import Dict, Any
from eth_account import Account
from eth_account.messages import encode_typed_data


class VolatilitySigner:
    def __init__(self, private_key: str, verifying_contract: str, chain_id: int = 4663):
        self.account = Account.from_key(private_key)
        self.verifying_contract = verifying_contract
        self.chain_id = chain_id

    def build_eip712_data(
        self,
        stock: str,
        sigma_bps: int,
        skew_k: int,
        nonce: int,
        expires_at: int
    ) -> Dict[str, Any]:
        return {
            "types": {
                "EIP712Domain": [
                    {"name": "name", "type": "string"},
                    {"name": "version", "type": "string"},
                    {"name": "chainId", "type": "uint256"},
                    {"name": "verifyingContract", "type": "address"},
                ],
                "VolReading": [
                    {"name": "stock", "type": "address"},
                    {"name": "sigmaBps", "type": "uint64"},
                    {"name": "skewK", "type": "uint64"},
                    {"name": "nonce", "type": "uint64"},
                    {"name": "expiresAt", "type": "uint64"},
                ],
            },
            "primaryType": "VolReading",
            "domain": {
                "name": "ArcumVolOracle",
                "version": "1",
                "chainId": self.chain_id,
                "verifyingContract": self.verifying_contract,
            },
            "message": {
                "stock": stock,
                "sigmaBps": sigma_bps,
                "skewK": skew_k,
                "nonce": nonce,
                "expiresAt": expires_at,
            },
        }

    def sign_vol_reading(
        self,
        stock: str,
        sigma_bps: int,
        skew_k: int,
        nonce: int,
        expires_at: int
    ) -> str:
        data = self.build_eip712_data(stock, sigma_bps, skew_k, nonce, expires_at)
        signable_message = encode_typed_data(full_message=data)
        signed = self.account.sign_message(signable_message)
        return signed.signature.hex()

    @staticmethod
    def recover_signer(data: Dict[str, Any], signature_hex: str) -> str:
        signable_message = encode_typed_data(full_message=data)
        return Account.recover_message(signable_message, signature=bytes.fromhex(signature_hex.replace("0x", "")))
