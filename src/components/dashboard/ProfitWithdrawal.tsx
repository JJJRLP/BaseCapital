"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { encodeFunctionData, parseUnits } from "viem";
import { ACTIVE_CHAIN_ID } from "@/lib/contracts";
import { traderAccountABI } from "@/lib/abis";

interface ProfitWithdrawalProps {
    traderAccountAddress?: string;
    withdrawableProfit: number;
    isActive: boolean;
    onSuccess?: () => void;
}

export function ProfitWithdrawal({
    traderAccountAddress,
    withdrawableProfit,
    isActive,
    onSuccess,
}: ProfitWithdrawalProps) {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const maxWithdrawable = withdrawableProfit;
    const withdrawAmount = parseFloat(amount) || 0;
    const isValidAmount = withdrawAmount > 0 && withdrawAmount <= maxWithdrawable;

    // Build withdrawal transaction
    const buildWithdrawCall = () => {
        if (!traderAccountAddress || !isValidAmount) return [];

        const amountInWei = parseUnits(amount, 6); // USDC has 6 decimals

        return [{
            to: traderAccountAddress as `0x${string}`,
            data: encodeFunctionData({
                abi: traderAccountABI,
                functionName: 'withdrawProfit',
                args: [amountInWei]
            })
        }];
    };

    const handleSuccess = () => {
        setAmount('');
        setShowConfirm(false);
        onSuccess?.();
    };

    const handleSetMax = () => {
        setAmount(maxWithdrawable.toFixed(2));
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[var(--color-gold)]" />
                    <h2 className="text-xl font-medium text-white">Withdraw Profits</h2>
                </div>
                {withdrawableProfit > 0 && (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Profits Available
                    </span>
                )}
            </div>

            {/* Available Balance */}
            <div className="bg-zinc-950/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-zinc-400 mb-1">Available to Withdraw</p>
                <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-green-400">
                        ${maxWithdrawable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-sm text-zinc-500">USDC</span>
                </div>
            </div>

            {/* Withdrawal Form */}
            {maxWithdrawable > 0 ? (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Withdrawal Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xl font-medium text-white outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                                disabled={!isActive}
                            />
                            <button
                                onClick={handleSetMax}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded text-[var(--color-gold)] transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                        {withdrawAmount > maxWithdrawable && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Exceeds available balance
                            </p>
                        )}
                    </div>

                    {/* 80/20 Split Notice */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300">
                            <strong>Note:</strong> Withdrawals are subject to 80/20 profit split.
                            You receive 80% (${(withdrawAmount * 0.8).toFixed(2)}).
                        </p>
                    </div>

                    {/* Withdraw Button */}
                    {traderAccountAddress && isConnected && isActive ? (
                        <Transaction
                            chainId={ACTIVE_CHAIN_ID}
                            calls={buildWithdrawCall()}
                            onSuccess={handleSuccess}
                        >
                            <TransactionButton
                                className="w-full py-4 bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-black font-medium rounded-xl flex items-center justify-center gap-2"
                                text={`Withdraw $${withdrawAmount.toFixed(2)}`}
                                disabled={!isValidAmount}
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
                            {!isConnected ? 'Connect Wallet' : !isActive ? 'Account Not Active' : 'Unavailable'}
                        </Button>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowUpRight className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-zinc-400 mb-2">No profits available yet</p>
                    <p className="text-sm text-zinc-500">
                        You can withdraw once your equity exceeds your initial capital.
                    </p>
                </div>
            )}

            {/* Withdrawal History Link */}
            {isConnected && (
                <div className="mt-6 pt-4 border-t border-zinc-800">
                    <a
                        href={`https://basescan.org/address/${traderAccountAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                        View on Basescan <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            )}
        </div>
    );
}
