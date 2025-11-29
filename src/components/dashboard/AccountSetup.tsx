"use client";

import { motion } from "framer-motion";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { CheckCircle, XCircle, Award } from "lucide-react";

const ACCOUNT_SIZES = [5000, 20000, 50000];

export function AccountSetup() {
    const { account, startChallenge } = useEvaluation();
    const [selectedSize, setSelectedSize] = useState(5000);

    if (account) {
        return (
            <div className="mb-8 p-8 bg-zinc-900/30 border border-zinc-800 rounded-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-light text-white mb-2">
                            Evaluation Account - <span className="text-[var(--color-gold)] capitalize">{account.stage}</span>
                        </h2>
                        <p className="text-zinc-500 text-sm">
                            Initial Balance: ${account.initialBalance.toLocaleString()}
                        </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-sm ${account.status === 'active' ? 'bg-blue-900/20 text-blue-400' :
                        account.status === 'passed' ? 'bg-green-900/20 text-green-400' :
                            'bg-red-900/20 text-red-400'
                        }`}>
                        {account.status === 'active' && <Activity className="w-5 h-5" />}
                        {account.status === 'passed' && <CheckCircle className="w-5 h-5" />}
                        {account.status === 'failed' && <XCircle className="w-5 h-5" />}
                        <span className="uppercase font-bold text-sm">{account.status}</span>
                    </div>
                </div>

                {account.status === 'failed' && (
                    <div className="mb-6 p-4 bg-red-900/10 border border-red-900/50 rounded-sm">
                        <p className="text-red-400 text-sm">
                            <strong>Failed:</strong> {account.violationReason}
                        </p>
                    </div>
                )}

                {account.status === 'passed' && (
                    <div className="mb-6 p-6 bg-green-900/10 border border-green-900/50 rounded-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="w-6 h-6 text-[var(--color-gold)]" />
                            <p className="text-green-400 font-medium">
                                Congratulations! You passed the {account.stage} stage.
                            </p>
                        </div>
                        {account.stage === 'challenge' && (
                            <p className="text-zinc-400 text-sm mb-4">
                                You can now proceed to the Verification stage to prove consistency.
                            </p>
                        )}
                        {account.stage === 'verification' && (
                            <p className="text-zinc-400 text-sm mb-4">
                                You are now eligible for a Funded Account! Contact support for identity verification.
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase mb-1">Trading Days</p>
                        <p className="text-white text-xl">{account.tradingDays}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase mb-1">Total Trades</p>
                        <p className="text-white text-xl">{account.totalTrades}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase mb-1">Open Trades</p>
                        <p className="text-white text-xl">{account.trades.filter(t => !t.closeTime).length}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase mb-1">Closed Trades</p>
                        <p className="text-white text-xl">{account.trades.filter(t => t.closeTime).length}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-zinc-900/30 border border-zinc-800 rounded-sm"
        >
            <h2 className="text-2xl font-light text-white mb-6">
                Start Your <span className="text-[var(--color-gold)]">Challenge</span>
            </h2>
            <p className="text-zinc-400 mb-8">
                Select an account size to begin your evaluation. Reach the profit target while following all risk rules.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {ACCOUNT_SIZES.map((size) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-6 border transition-all ${selectedSize === size
                            ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5'
                            : 'border-zinc-800 hover:border-zinc-700'
                            }`}
                    >
                        <p className="text-2xl font-light text-white">${(size / 1000).toFixed(0)}K</p>
                    </button>
                ))}
            </div>

            <Button
                onClick={() => startChallenge(selectedSize)}
                className="w-full md:w-auto bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90"
            >
                Start Challenge
            </Button>
        </motion.div>
    );
}

function Activity({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}
