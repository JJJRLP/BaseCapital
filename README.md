# Base Capital 12/18/2025

**On-chain prop trading infrastructure built on Base.**

## Overview

Base Capital is a decentralized proprietary trading firm that enables traders to access firm capital through smart contract-enforced risk management. Built natively on Base with USDC accounting.

The BAse Capital Manifesto will on following days after some reviews are done to the document;
## Tech Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **Blockchain**: Base (Coinbase L2), Solidity, Foundry
- **Wallet**: OnchainKit with Coinbase Smart Wallet + Passkeys
- **Payments**: USDC on Base for subscriptions and payouts
- **Database**: Supabase (PostgreSQL) + Prisma ORM

## Smart Contracts

| Contract | Purpose |
|----------|---------|
| `PropFirmFactory.sol` | Challenge deployment and lifecycle management |
| `TraderAccount.sol` | Isolated smart wallet for whitelisted DEX trades |
| `RiskManager.sol` | Real-time drawdown enforcement and position limits |
| `Treasury.sol` | USDC capital pool and profit distribution |
| `CertificateNFT.sol` | On-chain achievement certificates |

## Key Features

- ⚡ **Instant USDC Payouts** - No banking friction
- 🔐 **Smart Wallet Auth** - Passkey-based, no seed phrases
- 📊 **On-Chain Risk Management** - Transparent and verifiable
- 🎯 **Whitelisted DEX Trading** - Aerodrome, Uniswap on Base

## Business Model

### Challenge Fees (One-time, in USDC)

| Plan | Fee | Funded Capital |
|------|-----|----------------|
| Starter | $49.99 | $5,000 |
| Professional | $159.99 | $25,000 |
| Executive | $299.99 | $50,000 |

### Profit Split (Recurring, on funded accounts)

| Party | Share |
|-------|-------|
| Trader | 80% |
| Protocol | 20% |

Profit splits are enforced on-chain via `Treasury.sol`. Traders can only withdraw profits above their initial capital allocation.

## Development Workflow

This project follows a **local-first development approach**. Extensive testing and iteration happens on local development environments before changes are pushed to the repository. This ensures cleaner commit history and production-ready code.

## License

[MIT](./LICENSE)

## Security

See [SECURITY.md](./SECURITY.md) for our security model and vulnerability reporting.
