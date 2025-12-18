# Base Capital Smart Contracts

Solidity smart contracts for the Base Capital on-chain PropFirm. Built with Foundry.

## Contracts

| Contract | Purpose |
|----------|---------|
| **PropFirmFactory.sol** | Manages trader registration, USDC fee collection, and stage progression |
| **TraderAccountFactory.sol** | Deploys isolated TraderAccount smart wallets for funded traders |
| **TraderAccount.sol** | Smart wallet for traders - DEX trading with firm capital, restricted withdrawals |
| **RiskManager.sol** | On-chain rule enforcement - drawdown limits, profit targets, auto-liquidation |
| **Treasury.sol** | USDC capital pool, account seeding, profit splits (80/20) |
| **CertificateNFT.sol** | ERC-721 certificates minted when traders pass stages |

## Architecture

```
User pays USDC → PropFirmFactory → Registers Trader
                       ↓
              Challenge/Verification (off-chain simulation)
                       ↓
              Trader Passes → CertificateNFT minted
                       ↓
              Funded Stage → TraderAccountFactory deploys TraderAccount
                       ↓
              Treasury seeds capital → TraderAccount
                       ↓
              Trader executes swaps → Whitelisted DEXs (Aerodrome/Uniswap)
                       ↓
              RiskManager monitors → Chainlink Automation (checkStatus)
                       ↓
              Profit withdrawal → 80% trader / 20% protocol
```

## Risk Management

The **RiskManager** enforces rules on-chain:

| Stage | Profit Target | Max Daily Loss | Max Total Loss | Min Days |
|-------|--------------|----------------|----------------|----------|
| Challenge | 8% | 5% | 8% | 5 |
| Verification | 5% | 5% | 8% | 5 |
| Funded | N/A | 5% | 10% | 0 |

Keeper bots (Chainlink Automation) call `checkStatus()` to:
- Liquidate accounts that exceed drawdown limits
- Upgrade traders who hit profit targets with required trading days

## Setup

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit
```

### 3. Configure Environment

Create a `.env` file in the contracts directory:

```bash
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

Load environment:
```bash
source .env
```

## Deployment

### Base Sepolia (Testnet)

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

### Base Mainnet (Production)

```bash
forge script script/Deploy.s.sol:DeployMainnet \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --broadcast \
  --verify
```

## Testing

```bash
forge test -vvv
```

## Contract Addresses

### Base Sepolia

| Contract | Address |
|----------|---------|
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| PropFirmFactory | TBD |
| TraderAccountFactory | TBD |
| RiskManager | TBD |
| Treasury | TBD |
| CertificateNFT | TBD |

### Base Mainnet

| Contract | Address |
|----------|---------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| PropFirmFactory | TBD |
| TraderAccountFactory | TBD |
| RiskManager | TBD |
| Treasury | TBD |
| CertificateNFT | TBD |

## Key Features

- **Capital Isolation**: Each trader gets their own smart wallet
- **Whitelisted DEXs**: Only approved routers (Aerodrome, Uniswap) can execute swaps
- **Restricted Withdrawals**: Traders can only withdraw profits, not principal
- **USDC Accounting**: All capital denominated in USDC to avoid volatility
- **Chainlink Automation**: Real-time monitoring via keeper bots
