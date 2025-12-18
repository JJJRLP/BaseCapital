"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";

interface EquityDisplayProps {
    initialCapital: number;
    currentEquity: number;
    dailyStartingEquity: number;
    stage: 'challenge' | 'verification' | 'funded';
    tradingDays: number;
    isActive: boolean;
}

// Rule thresholds
const RULES = {
    challenge: { profitTarget: 0.08, dailyLoss: 0.05, totalLoss: 0.08, minDays: 5 },
    verification: { profitTarget: 0.05, dailyLoss: 0.05, totalLoss: 0.08, minDays: 5 },
    funded: { profitTarget: 0, dailyLoss: 0.05, totalLoss: 0.08, minDays: 0 },
};

export function EquityDisplay({
    initialCapital,
    currentEquity,
    dailyStartingEquity,
    stage,
    tradingDays,
    isActive,
}: EquityDisplayProps) {
    const rules = RULES[stage];

    // Calculate values
    const totalPnL = currentEquity - initialCapital;
    const totalPnLPercent = initialCapital > 0 ? (totalPnL / initialCapital) * 100 : 0;

    const dailyPnL = currentEquity - dailyStartingEquity;
    const dailyPnLPercent = dailyStartingEquity > 0 ? (dailyPnL / dailyStartingEquity) * 100 : 0;

    // Check thresholds
    const maxTotalLoss = initialCapital * rules.totalLoss;
    const maxDailyLoss = dailyStartingEquity * rules.dailyLoss;
    const profitTarget = initialCapital * rules.profitTarget;

    const totalLossRemaining = maxTotalLoss + totalPnL;
    const dailyLossRemaining = maxDailyLoss + dailyPnL;

    const totalLossPercent = totalLossRemaining > 0 ? (totalLossRemaining / maxTotalLoss) * 100 : 0;
    const dailyLossPercent = dailyLossRemaining > 0 ? (dailyLossRemaining / maxDailyLoss) * 100 : 0;

    const profitProgress = profitTarget > 0
        ? Math.min(100, Math.max(0, (totalPnL / profitTarget) * 100))
        : 100;

    const isPassable = stage !== 'funded' && totalPnL >= profitTarget && tradingDays >= rules.minDays;

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-white">Account Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stage === 'funded'
                        ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                        : stage === 'verification'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                    }`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </span>
            </div>

            {/* Main Values */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-950/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-zinc-400">Current Equity</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        ${currentEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-zinc-950/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {totalPnL >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm text-zinc-400">Total P&L</span>
                    </div>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="text-sm ml-1">({totalPnLPercent.toFixed(2)}%)</span>
                    </p>
                </div>
            </div>

            {/* Risk Gauges */}
            <div className="space-y-4 mb-6">
                {/* Daily Drawdown */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">Daily Drawdown</span>
                        <span className={`text-sm font-medium ${dailyLossPercent > 50 ? 'text-red-400' : dailyLossPercent > 25 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                            {dailyPnLPercent.toFixed(2)}% (Max {(rules.dailyLoss * 100).toFixed(0)}%)
                        </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, 100 - dailyLossPercent)}%` }}
                            className={`h-full rounded-full ${dailyLossPercent > 75 ? 'bg-red-500' : dailyLossPercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                        />
                    </div>
                </div>

                {/* Total Drawdown */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">Total Drawdown</span>
                        <span className={`text-sm font-medium ${totalLossPercent < 50 ? 'text-red-400' : totalLossPercent < 75 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                            ${totalLossRemaining.toFixed(2)} remaining
                        </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${totalLossPercent}%` }}
                            className={`h-full rounded-full ${totalLossPercent < 25 ? 'bg-red-500' : totalLossPercent < 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                        />
                    </div>
                </div>

                {/* Profit Target (not for funded) */}
                {stage !== 'funded' && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-zinc-400">Profit Target</span>
                            <span className={`text-sm font-medium ${profitProgress >= 100 ? 'text-green-400' : 'text-zinc-300'
                                }`}>
                                {profitProgress.toFixed(1)}% ({(rules.profitTarget * 100).toFixed(0)}% target)
                            </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${profitProgress}%` }}
                                className={`h-full rounded-full ${profitProgress >= 100 ? 'bg-green-500' : 'bg-[var(--color-gold)]'
                                    }`}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Trading Days */}
            {stage !== 'funded' && rules.minDays > 0 && (
                <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-zinc-400">Trading Days</span>
                    </div>
                    <span className={`text-sm font-medium ${tradingDays >= rules.minDays ? 'text-green-400' : 'text-zinc-300'
                        }`}>
                        {tradingDays} / {rules.minDays}
                        {tradingDays >= rules.minDays && <CheckCircle className="w-4 h-4 inline ml-1" />}
                    </span>
                </div>
            )}

            {/* Status Messages */}
            {!isActive && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-red-300">Account is not active</span>
                </div>
            )}

            {isPassable && isActive && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-300">
                        Ready to advance to {stage === 'challenge' ? 'Verification' : 'Funded'} stage!
                    </span>
                </div>
            )}
        </div>
    );
}
