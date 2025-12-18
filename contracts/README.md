# Base Capital Smart Contracts

Solidity smart contracts for the Base Capital on-chain PropFirm.

## Contracts

- **PropFirmFactory.sol** - Manages trader registration, USDC fee collection, and stage progression
- **CertificateNFT.sol** - ERC-721 certificates minted when traders pass stages

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
| PropFirmFactory | TBD (after deployment) |
| CertificateNFT | TBD (after deployment) |

### Base Mainnet
| Contract | Address |
|----------|---------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| PropFirmFactory | TBD |
| CertificateNFT | TBD |

## Architecture

```
User pays USDC → PropFirmFactory → Registers Trader
                       ↓
              Off-chain Trading Simulation
                       ↓
Admin verifies → upgradeTrader() → CertificateNFT minted
```
