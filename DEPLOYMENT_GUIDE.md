# Deployment Guide for BaseCapital

This guide details how to configure and deploy your BaseCapital dApp to the Base network using Vercel.

## 1. Prerequisites

Before you begin, ensure you have the following:

-   **GitHub Account**: For hosting your code.
-   **Vercel Account**: For deploying the frontend.
-   **Coinbase Developer Platform (CDP) Account**: For OnchainKit API keys.

## 2. Configuration

### Step 1: Get OnchainKit API Key

1.  Log in to the [Coinbase Developer Platform](https://portal.cdp.coinbase.com/).
2.  Create a new project (e.g., "BaseCapital").
3.  Navigate to the **API Keys** section or **OnchainKit** section.
4.  Create a new API Key. You will need the **Client Key** (public) for your frontend.
    *   *Note: Ensure you allow the domains you will be deploying to (e.g., `localhost:3000` for dev, `your-app.vercel.app` for prod) in the allowed origins if applicable.*

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add your API key:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_public_api_key_here
```

### Step 3: Prepare for Production (Mainnet)

Currently, your project is configured for **Base Sepolia** (Testnet). For production, you need to switch to **Base Mainnet**.

1.  Open `src/components/OnchainProviders.tsx`.
2.  Update the imports and configuration to include `base`:

```typescript
// src/components/OnchainProviders.tsx

// 1. Import 'base'
import { base, baseSepolia } from 'wagmi/chains'; 

// ...

const wagmiConfig = createConfig({
    // 2. Update chains array to include 'base' (or replace baseSepolia if you only want mainnet)
    chains: [base, baseSepolia], 
    connectors: [
        coinbaseWallet({
            appName: 'BaseCapital',
            preference: { options: 'smartWalletOnly' },
        }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(), // 3. Add transport for Base Mainnet
        [baseSepolia.id]: http(),
    },
});

// ...

export function OnchainProviders({ children }: OnchainProvidersProps) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={base} // 4. Set default chain to 'base' for production
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
```

> **Tip**: You can use an environment variable to switch chains dynamically if you want to keep both testnet and mainnet configurations.

## 3. Deployment to Vercel

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Import Project in Vercel**:
    *   Go to your Vercel Dashboard.
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `BaseCapital` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add `NEXT_PUBLIC_ONCHAINKIT_API_KEY` with your production API key from CDP.
5.  **Deploy**: Click **"Deploy"**.

## 4. Verification

After deployment:

1.  Visit your Vercel deployment URL (e.g., `https://base-capital.vercel.app`).
2.  Check the browser console for any errors.
3.  Try connecting your wallet.
    *   Since you are using `smartWalletOnly`, it should prompt to create or connect a Coinbase Smart Wallet (Passkey).
4.  Verify that the network is correct (Base Mainnet).

## 5. Smart Contracts (Optional)

If you plan to deploy smart contracts:

1.  Use **Hardhat** or **Foundry**.
2.  Configure your `hardhat.config.ts` or `foundry.toml` with Base network settings.
    *   **Base Mainnet RPC**: `https://mainnet.base.org`
    *   **Base Sepolia RPC**: `https://sepolia.base.org`
    *   **Chain ID**: `8453` (Mainnet), `84532` (Sepolia)
3.  Verify your contracts on [Basescan](https://basescan.org/) after deployment.

---

**Resources:**
-   [Base Documentation](https://docs.base.org/)
-   [OnchainKit Documentation](https://onchainkit.xyz/)
-   [Vercel Deployment Docs](https://vercel.com/docs)
