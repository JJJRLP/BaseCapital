/**
 * Token configuration for Base trading
 * Includes popular tokens with their addresses and metadata
 */

// Token interface
export interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
}

// Base Mainnet tokens
export const TOKENS_MAINNET: Token[] = [
    {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
    {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    },
    {
        symbol: 'cbBTC',
        name: 'Coinbase Wrapped BTC',
        address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
        decimals: 8,
        logoURI: 'https://assets.coingecko.com/coins/images/40143/standard/cbbtc.png',
    },
    {
        symbol: 'AERO',
        name: 'Aerodrome',
        address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
        decimals: 18,
        logoURI: 'https://aerodrome.finance/logo.png',
    },
    {
        symbol: 'USDbC',
        name: 'USD Base Coin',
        address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/31164/small/usdbc.png',
    },
    {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
    },
];

// Base Sepolia testnet tokens
export const TOKENS_SEPOLIA: Token[] = [
    {
        symbol: 'USDC',
        name: 'USD Coin (Test)',
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
    {
        symbol: 'WETH',
        name: 'Wrapped Ether (Test)',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    },
];

// Export based on environment
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
export const TOKENS = IS_MAINNET ? TOKENS_MAINNET : TOKENS_SEPOLIA;

// Helper to get token by symbol
export function getTokenBySymbol(symbol: string): Token | undefined {
    return TOKENS.find(t => t.symbol === symbol);
}

// Helper to get token by address
export function getTokenByAddress(address: string): Token | undefined {
    return TOKENS.find(t => t.address.toLowerCase() === address.toLowerCase());
}

// Default trading pair
export const DEFAULT_TOKEN_IN = getTokenBySymbol('USDC');
export const DEFAULT_TOKEN_OUT = getTokenBySymbol('WETH');

// Aerodrome pool factory address
export const AERODROME_FACTORY = IS_MAINNET
    ? '0x420DD381b31aEf6683db6B902084cB0FFECe40Da'
    : '0x420DD381b31aEf6683db6B902084cB0FFECe40Da';
