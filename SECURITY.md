# Security

## Smart Contract Security Model

Base Capital employs a multi-layered security architecture for on-chain trading operations.

### Risk Management (RiskManager.sol)

- **Real-time drawdown monitoring** via Chainlink Automation keepers
- Automatic liquidation when limits exceeded
- Configurable thresholds per stage (Challenge/Verification/Funded)

| Stage | Max Daily Loss | Max Total Loss |
|-------|----------------|----------------|
| Challenge | 5% | 8% |
| Verification | 5% | 8% |
| Funded | 5% | 10% |

### Capital Isolation (TraderAccount.sol)

- Each trader operates via **isolated smart wallet**
- Principal capital **cannot be withdrawn** by trader
- Only whitelisted DEX routers can execute swaps (Aerodrome, Uniswap)
- Profits validated via `getEquity()` before withdrawal

### Treasury Controls (Treasury.sol)

- Capital allocation tracked per trader account
- Profit splits enforced on-chain (80% trader / 20% protocol)
- Emergency withdrawal requires owner signature
- Recovery mechanisms for liquidated accounts

### Access Control

| Contract | Admin Functions | Protected By |
|----------|-----------------|--------------|
| PropFirmFactory | upgradeTrader, setTreasury | Ownable |
| RiskManager | updateRules, setFactory | Ownable |
| Treasury | withdraw, setFactory | Ownable |
| TraderAccount | activate, liquidate | Factory/RiskManager only |

## Wallet Security

- **Coinbase Smart Wallet** with Passkey authentication
- No seed phrases - biometric/device-bound keys
- Account abstraction reduces phishing risk

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to maintainers directly
3. Allow reasonable time for patches before disclosure

## Audit Status

> **Note:** Smart contracts are pending formal security audit. Use at your own risk on mainnet. Production deployment should be preceded by professional audit.

## Best Practices for Users

- Only connect wallets you intend to use for trading
- Verify transaction details before signing
- Start with evaluation accounts before live trading
- Monitor your account equity via the dashboard
