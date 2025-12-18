# Deployment Guide for Base Capital

This guide covers deploying the Base Capital dApp to Base network using Vercel (frontend) and Foundry (smart contracts).

## Prerequisites

- **GitHub Account** - For hosting code
- **Vercel Account** - For frontend deployment
- **Coinbase Developer Platform (CDP) Account** - For OnchainKit API keys
- **Foundry** - For smart contract deployment

## Frontend Deployment

### 1. Configure OnchainKit

1. Login to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a project for "Base Capital"
3. Get your **Client Key** (public) from the API Keys section
4. Allow your domains in the allowed origins

### 2. Environment Variables

Create `.env.local`:

```bash
# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

### 3. Network Configuration

The app supports both testnet and mainnet. Edit `src/components/OnchainProviders.tsx`:

```typescript
import { base, baseSepolia } from 'wagmi/chains';

const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'BaseCapital',
            preference: { options: 'smartWalletOnly' },
        }),
    ],
    // ...
});
```

### 4. Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy

## Smart Contract Deployment

See [contracts/README.md](./contracts/README.md) for full instructions.

### Quick Start

```bash
cd contracts
source .env

# Testnet
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast --verify

# Mainnet
forge script script/Deploy.s.sol:DeployMainnet \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --broadcast --verify
```

### Update Frontend Contract Addresses

After deployment, update `src/lib/contracts.ts`:

```typescript
export const CONTRACTS = {
    PROP_FIRM_FACTORY: '0x...',
    RISK_MANAGER: '0x...',
    TREASURY: '0x...',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
};
```

## Verification

1. Visit your Vercel deployment
2. Connect wallet (Smart Wallet with Passkeys)
3. Verify network is correct (Base Mainnet/Sepolia)
4. Test challenge registration flow

## Resources

- [Base Documentation](https://docs.base.org/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Supabase Documentation](https://supabase.com/docs)
