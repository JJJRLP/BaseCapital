/**
 * Contract addresses for Base Capital
 * Update these after deployment
 */

// Base Sepolia (Testnet) addresses
export const CONTRACTS_SEPOLIA = {
    // Core tokens
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,

    // Phase 1 contracts (deploy first)
    PROP_FIRM_FACTORY: '' as const, // TODO: Update after deployment
    CERTIFICATE_NFT: '' as const,   // TODO: Update after deployment

    // Phase 3 contracts (deploy after)
    RISK_MANAGER: '' as const,
    TREASURY: '' as const,
    TRADER_ACCOUNT_FACTORY: '' as const,

    // DEX Routers (already deployed on Base Sepolia)
    AERODROME_ROUTER: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43' as const,
    UNISWAP_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481' as const,
} as const;

// Base Mainnet addresses
export const CONTRACTS_MAINNET = {
    // Core tokens
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,

    // Phase 1 contracts
    PROP_FIRM_FACTORY: '' as const,
    CERTIFICATE_NFT: '' as const,

    // Phase 3 contracts
    RISK_MANAGER: '' as const,
    TREASURY: '' as const,
    TRADER_ACCOUNT_FACTORY: '' as const,

    // DEX Routers (mainnet addresses)
    AERODROME_ROUTER: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43' as const,
    UNISWAP_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481' as const,
} as const;

// Use testnet by default, switch to mainnet for production
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
export const CONTRACTS = IS_MAINNET ? CONTRACTS_MAINNET : CONTRACTS_SEPOLIA;

// Chain IDs
export const CHAIN_IDS = {
    BASE_SEPOLIA: 84532,
    BASE_MAINNET: 8453,
} as const;

export const ACTIVE_CHAIN_ID = IS_MAINNET ? CHAIN_IDS.BASE_MAINNET : CHAIN_IDS.BASE_SEPOLIA;
