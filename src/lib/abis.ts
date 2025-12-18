/**
 * ABI for PropFirmFactory contract
 * Generated from contracts/src/PropFirmFactory.sol
 */
export const propFirmFactoryABI = [
    {
        "type": "constructor",
        "inputs": [{ "name": "_usdc", "type": "address" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "startChallenge",
        "inputs": [{ "name": "planId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "restartChallenge",
        "inputs": [{ "name": "planId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getTrader",
        "inputs": [{ "name": "traderAddress", "type": "address" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    { "name": "wallet", "type": "address" },
                    { "name": "planId", "type": "uint256" },
                    { "name": "stage", "type": "uint8" },
                    { "name": "startTime", "type": "uint256" },
                    { "name": "stageStartTime", "type": "uint256" },
                    { "name": "active", "type": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPlan",
        "inputs": [{ "name": "planId", "type": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    { "name": "id", "type": "uint256" },
                    { "name": "name", "type": "string" },
                    { "name": "feeAmount", "type": "uint256" },
                    { "name": "virtualCapital", "type": "uint256" },
                    { "name": "active", "type": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isActiveTrader",
        "inputs": [{ "name": "traderAddress", "type": "address" }],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getTraderStage",
        "inputs": [{ "name": "traderAddress", "type": "address" }],
        "outputs": [{ "name": "", "type": "uint8" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "traders",
        "inputs": [{ "name": "", "type": "address" }],
        "outputs": [
            { "name": "wallet", "type": "address" },
            { "name": "planId", "type": "uint256" },
            { "name": "stage", "type": "uint8" },
            { "name": "startTime", "type": "uint256" },
            { "name": "stageStartTime", "type": "uint256" },
            { "name": "active", "type": "bool" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "plans",
        "inputs": [{ "name": "", "type": "uint256" }],
        "outputs": [
            { "name": "id", "type": "uint256" },
            { "name": "name", "type": "string" },
            { "name": "feeAmount", "type": "uint256" },
            { "name": "virtualCapital", "type": "uint256" },
            { "name": "active", "type": "bool" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalPlans",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalTraders",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalFeesCollected",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "ChallengeStarted",
        "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "planId", "type": "uint256", "indexed": true },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "TraderUpgraded",
        "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "previousStage", "type": "uint8", "indexed": false },
            { "name": "newStage", "type": "uint8", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "TraderFailed",
        "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "stage", "type": "uint8", "indexed": false },
            { "name": "reason", "type": "string", "indexed": false }
        ]
    }
] as const;

/**
 * Standard ERC-20 ABI (subset for USDC approval)
 */
export const erc20ABI = [
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "allowance",
        "inputs": [
            { "name": "owner", "type": "address" },
            { "name": "spender", "type": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{ "name": "account", "type": "address" }],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint8" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string" }],
        "stateMutability": "view"
    }
] as const;

/**
 * ABI for CertificateNFT contract
 */
export const certificateNFTABI = [
    {
        "type": "function",
        "name": "getCertificatesForTrader",
        "inputs": [{ "name": "trader", "type": "address" }],
        "outputs": [{ "name": "", "type": "uint256[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getCertificate",
        "inputs": [{ "name": "tokenId", "type": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    { "name": "trader", "type": "address" },
                    { "name": "stage", "type": "uint8" },
                    { "name": "planId", "type": "uint256" },
                    { "name": "balanceAchieved", "type": "uint256" },
                    { "name": "issuedAt", "type": "uint256" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{ "name": "owner", "type": "address" }],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "tokenURI",
        "inputs": [{ "name": "tokenId", "type": "uint256" }],
        "outputs": [{ "name": "", "type": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "CertificateMinted",
        "inputs": [
            { "name": "tokenId", "type": "uint256", "indexed": true },
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "stage", "type": "uint8", "indexed": false },
            { "name": "balanceAchieved", "type": "uint256", "indexed": false }
        ]
    }
] as const;

/**
 * ABI for TraderAccount contract (trading wallet)
 */
export const traderAccountABI = [
    {
        "type": "function",
        "name": "executeSwap",
        "inputs": [
            { "name": "router", "type": "address" },
            { "name": "swapData", "type": "bytes" }
        ],
        "outputs": [{ "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveRouter",
        "inputs": [
            { "name": "token", "type": "address" },
            { "name": "router", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawProfit",
        "inputs": [{ "name": "amount", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getEquity",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPnL",
        "inputs": [],
        "outputs": [{ "name": "", "type": "int256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getWithdrawableProfit",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isAccountActive",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "initialCapital",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "trader",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "TradeExecuted",
        "inputs": [
            { "name": "router", "type": "address", "indexed": true },
            { "name": "selector", "type": "bytes4", "indexed": false },
            { "name": "success", "type": "bool", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "ProfitWithdrawn",
        "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "amount", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "AccountLiquidated",
        "inputs": [
            { "name": "liquidator", "type": "address", "indexed": true },
            { "name": "reason", "type": "string", "indexed": false }
        ]
    }
] as const;

/**
 * ABI for RiskManager contract
 */
export const riskManagerABI = [
    {
        "type": "function",
        "name": "checkStatus",
        "inputs": [{ "name": "account", "type": "address" }],
        "outputs": [{ "name": "status", "type": "uint8" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getTraderState",
        "inputs": [{ "name": "account", "type": "address" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    { "name": "accountContract", "type": "address" },
                    { "name": "initialBalance", "type": "uint256" },
                    { "name": "dailyStartingEquity", "type": "uint256" },
                    { "name": "lastDayReset", "type": "uint256" },
                    { "name": "stage", "type": "uint8" },
                    { "name": "tradingDays", "type": "uint8" },
                    { "name": "isActive", "type": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "wouldFail",
        "inputs": [{ "name": "account", "type": "address" }],
        "outputs": [
            { "name": "", "type": "bool" },
            { "name": "", "type": "string" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "wouldPass",
        "inputs": [{ "name": "account", "type": "address" }],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "TraderStatusChecked",
        "inputs": [
            { "name": "account", "type": "address", "indexed": true },
            { "name": "status", "type": "uint8", "indexed": false },
            { "name": "equity", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "TraderLiquidated",
        "inputs": [
            { "name": "account", "type": "address", "indexed": true },
            { "name": "reason", "type": "string", "indexed": false }
        ]
    }
] as const;

/**
 * ABI for Aerodrome Router (DEX swaps on Base)
 */
export const aerodromeRouterABI = [
    {
        "type": "function",
        "name": "swapExactTokensForTokens",
        "inputs": [
            { "name": "amountIn", "type": "uint256" },
            { "name": "amountOutMin", "type": "uint256" },
            {
                "name": "routes",
                "type": "tuple[]",
                "components": [
                    { "name": "from", "type": "address" },
                    { "name": "to", "type": "address" },
                    { "name": "stable", "type": "bool" },
                    { "name": "factory", "type": "address" }
                ]
            },
            { "name": "to", "type": "address" },
            { "name": "deadline", "type": "uint256" }
        ],
        "outputs": [{ "name": "amounts", "type": "uint256[]" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAmountsOut",
        "inputs": [
            { "name": "amountIn", "type": "uint256" },
            {
                "name": "routes",
                "type": "tuple[]",
                "components": [
                    { "name": "from", "type": "address" },
                    { "name": "to", "type": "address" },
                    { "name": "stable", "type": "bool" },
                    { "name": "factory", "type": "address" }
                ]
            }
        ],
        "outputs": [{ "name": "amounts", "type": "uint256[]" }],
        "stateMutability": "view"
    }
] as const;
