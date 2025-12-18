"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Loader2, TrendingUp, TrendingDown, AlertCircle, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { encodeFunctionData, parseUnits, formatUnits } from "viem";
import { CONTRACTS, ACTIVE_CHAIN_ID } from "@/lib/contracts";
import { traderAccountABI, aerodromeRouterABI, erc20ABI } from "@/lib/abis";
import { Token, TOKENS, DEFAULT_TOKEN_IN, DEFAULT_TOKEN_OUT, AERODROME_FACTORY, getTokenBySymbol } from "@/lib/tokens";

interface TradingPanelProps {
    traderAccountAddress?: string;
    initialCapital?: number;
    currentEquity?: number;
    isActive?: boolean;
}

type TradeType = 'buy' | 'sell';

export function TradingPanel({
    traderAccountAddress,
    initialCapital = 0,
    currentEquity = 0,
    isActive = false
}: TradingPanelProps) {
    const { address, isConnected } = useAccount();

    // Trading state
    const [tradeType, setTradeType] = useState<TradeType>('buy');
    const [amountIn, setAmountIn] = useState('');
    const [tokenIn, setTokenIn] = useState<Token | undefined>(DEFAULT_TOKEN_IN);
    const [tokenOut, setTokenOut] = useState<Token | undefined>(DEFAULT_TOKEN_OUT);
    const [showTokenSelect, setShowTokenSelect] = useState<'in' | 'out' | null>(null);
    const [slippage, setSlippage] = useState(0.5); // 0.5%

    // Calculated values
    const pnl = currentEquity - initialCapital;
    const pnlPercent = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;
    const isProfit = pnl >= 0;

    // Check if contracts deployed
    const contractsDeployed = traderAccountAddress && traderAccountAddress !== '';

    // Swap tokens
    const handleSwapTokens = () => {
        const temp = tokenIn;
        setTokenIn(tokenOut);
        setTokenOut(temp);
    };

    // Build transaction calls for swap
    const buildSwapCalls = useMemo(() => {
        if (!traderAccountAddress || !tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
            return [];
        }

        try {
            const amountInParsed = parseUnits(amountIn, tokenIn.decimals);
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 300); // 5 min

            // Build Aerodrome route
            const route = [{
                from: tokenIn.address as `0x${string}`,
                to: tokenOut.address as `0x${string}`,
                stable: tokenIn.symbol === 'USDC' || tokenIn.symbol === 'USDbC' || tokenIn.symbol === 'DAI',
                factory: AERODROME_FACTORY as `0x${string}`,
            }];

            // Encode Aerodrome swap call
            const swapData = encodeFunctionData({
                abi: aerodromeRouterABI,
                functionName: 'swapExactTokensForTokens',
                args: [
                    amountInParsed,
                    BigInt(0), // amountOutMin (0 for now - should use quote)
                    route,
                    traderAccountAddress as `0x${string}`,
                    deadline
                ]
            });

            // First approve the token on TraderAccount
            const approveCall = {
                to: traderAccountAddress as `0x${string}`,
                data: encodeFunctionData({
                    abi: traderAccountABI,
                    functionName: 'approveRouter',
                    args: [
                        tokenIn.address as `0x${string}`,
                        CONTRACTS.AERODROME_ROUTER as `0x${string}`,
                        amountInParsed
                    ]
                })
            };

            // Then execute swap through TraderAccount
            const swapCall = {
                to: traderAccountAddress as `0x${string}`,
                data: encodeFunctionData({
                    abi: traderAccountABI,
                    functionName: 'executeSwap',
                    args: [
                        CONTRACTS.AERODROME_ROUTER as `0x${string}`,
                        swapData
                    ]
                })
            };

            return [approveCall, swapCall];
        } catch (error) {
            console.error('Error building swap calls:', error);
            return [];
        }
    }, [traderAccountAddress, tokenIn, tokenOut, amountIn]);

    // Handle successful trade
    const handleSuccess = () => {
        setAmountIn('');
        // Could add toast notification here
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-white">Trade</h2>
                <div className="flex items-center gap-2">
                    {isActive ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Active
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-full text-zinc-400 text-sm">
                            <AlertCircle className="w-3 h-3" />
                            Inactive
                        </span>
                    )}
                </div>
            </div>

            {/* Equity Display */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-zinc-950/50 rounded-xl">
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Initial Capital</p>
                    <p className="text-lg font-medium text-white">
                        ${initialCapital.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Current Equity</p>
                    <p className="text-lg font-medium text-white">
                        ${currentEquity.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">P&L</p>
                    <div className={`flex items-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-lg font-medium">
                            {isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Trade Type Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${tradeType === 'buy'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${tradeType === 'sell'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
                        }`}
                >
                    Sell
                </button>
            </div>

            {/* Token Input - Sell */}
            <div className="space-y-2 mb-2">
                <label className="text-sm text-zinc-400">
                    {tradeType === 'buy' ? 'You Pay' : 'You Sell'}
                </label>
                <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus-within:border-zinc-700">
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amountIn}
                        onChange={(e) => setAmountIn(e.target.value)}
                        className="flex-1 bg-transparent text-2xl font-medium text-white outline-none placeholder:text-zinc-600"
                        disabled={!isActive}
                    />
                    <button
                        onClick={() => setShowTokenSelect('in')}
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        {tokenIn ? (
                            <>
                                <span className="font-medium text-white">{tokenIn.symbol}</span>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                            </>
                        ) : (
                            <span className="text-zinc-400">Select</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-1 relative z-10">
                <button
                    onClick={handleSwapTokens}
                    className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                    <ArrowDownUp className="w-4 h-4 text-zinc-400" />
                </button>
            </div>

            {/* Token Output - Buy */}
            <div className="space-y-2 mt-2 mb-6">
                <label className="text-sm text-zinc-400">
                    {tradeType === 'buy' ? 'You Receive' : 'You Get'}
                </label>
                <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <input
                        type="text"
                        placeholder="0.00"
                        disabled
                        className="flex-1 bg-transparent text-2xl font-medium text-zinc-500 outline-none placeholder:text-zinc-600"
                    />
                    <button
                        onClick={() => setShowTokenSelect('out')}
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        {tokenOut ? (
                            <>
                                <span className="font-medium text-white">{tokenOut.symbol}</span>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                            </>
                        ) : (
                            <span className="text-zinc-400">Select</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Slippage Setting */}
            <div className="flex items-center justify-between mb-4 p-3 bg-zinc-950/50 rounded-lg">
                <span className="text-sm text-zinc-400">Slippage Tolerance</span>
                <div className="flex gap-2">
                    {[0.1, 0.5, 1.0].map(s => (
                        <button
                            key={s}
                            onClick={() => setSlippage(s)}
                            className={`px-2 py-1 text-xs rounded ${slippage === s
                                    ? 'bg-[var(--color-gold)] text-black'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            {s}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Trade Button */}
            {contractsDeployed && isConnected && isActive ? (
                <Transaction
                    chainId={ACTIVE_CHAIN_ID}
                    calls={buildSwapCalls}
                    onSuccess={handleSuccess}
                >
                    <TransactionButton
                        className={`w-full py-4 font-medium rounded-xl ${tradeType === 'buy'
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                        text={`${tradeType === 'buy' ? 'Buy' : 'Sell'} ${tokenOut?.symbol || 'Token'}`}
                        disabled={!amountIn || parseFloat(amountIn) <= 0}
                    />
                    <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                    </TransactionStatus>
                </Transaction>
            ) : (
                <Button
                    disabled
                    className="w-full py-4 bg-zinc-800 text-zinc-400 cursor-not-allowed"
                >
                    {!isConnected ? 'Connect Wallet' : !isActive ? 'Account Not Active' : 'Contracts Not Deployed'}
                </Button>
            )}

            {/* Token Selection Modal */}
            <AnimatePresence>
                {showTokenSelect && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowTokenSelect(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-full max-w-sm max-h-[60vh] overflow-y-auto"
                        >
                            <h3 className="text-lg font-medium text-white mb-4">Select Token</h3>
                            <div className="space-y-2">
                                {TOKENS.map((token) => (
                                    <button
                                        key={token.symbol}
                                        onClick={() => {
                                            if (showTokenSelect === 'in') {
                                                setTokenIn(token);
                                            } else {
                                                setTokenOut(token);
                                            }
                                            setShowTokenSelect(null);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${(showTokenSelect === 'in' && tokenIn?.symbol === token.symbol) ||
                                                (showTokenSelect === 'out' && tokenOut?.symbol === token.symbol)
                                                ? 'bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30'
                                                : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
                                            }`}
                                    >
                                        {token.logoURI && (
                                            <img
                                                src={token.logoURI}
                                                alt={token.symbol}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <div className="text-left">
                                            <p className="font-medium text-white">{token.symbol}</p>
                                            <p className="text-xs text-zinc-400">{token.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
