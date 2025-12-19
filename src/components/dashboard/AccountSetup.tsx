"use client";

import { motion } from "framer-motion";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { CheckCircle, XCircle, Award, TrendingUp, Calendar, Hash, ArrowUpRight } from "lucide-react";

// Alignment with On-Chain Plan Logic
const PLANS_SUMMARY = [
    { title: "Starter", size: 5000, color: "bg-blue-500" },
    { title: "Professional", size: 25000, color: "bg-[var(--color-gold)]" },
    { title: "Executive", size: 50000, color: "bg-purple-500" },
];

const ACCOUNT_SIZES = PLANS_SUMMARY.map(p => p.size);

export function AccountSetup() {
    const { account, startChallenge } = useEvaluation();
    const [selectedSize, setSelectedSize] = useState(5000);

    /* --- ACTIVE ACCOUNT VIEW --- */
    if (account) {
        return (
            <div className="mb-10 p-8 ios-glass rounded-[2rem]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
                            {account.stage === 'challenge' && 'Evaluation Phase'}
                            {account.stage === 'verification' && 'Verification Phase'}
                            {account.stage === 'funded' && 'Funded Account'}
                        </h2>
                        <div className="flex items-center gap-2 text-zinc-400 font-medium">
                            <span>Balance: <span className="text-white">${account.initialBalance.toLocaleString()}</span></span>
                            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                            <span className="capitalize text-[var(--color-gold)]">{account.stage}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md
                        ${account.status === 'active' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            account.status === 'passed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                'bg-red-500/10 border-red-500/20 text-red-400'}
                    `}>
                        {account.status === 'active' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                        {account.status === 'passed' && <CheckCircle className="w-4 h-4" />}
                        {account.status === 'failed' && <XCircle className="w-4 h-4" />}
                        <span className="uppercase font-bold text-xs tracking-wide">{account.status}</span>
                    </div>
                </div>

                {/* Notifications */}
                {account.status === 'failed' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="text-sm">
                            <strong className="text-red-300 block mb-1">Account Suspended</strong>
                            <span className="text-red-400/80">{account.violationReason}</span>
                        </div>
                    </div>
                )}

                {account.status === 'passed' && (
                    <div className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shrink-0">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-green-300 font-bold text-lg">Objective Complete</h4>
                            <p className="text-green-400/70 text-sm">
                                {account.stage === 'challenge'
                                    ? "Excellent work. You are ready for the Verification stage."
                                    : "You're now eligible for a Funded Account. Contact support."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        label="Trading Days"
                        value={account.tradingDays.toString()}
                        icon={Calendar}
                        subValue="Minimum 5"
                    />
                    <MetricCard
                        label="Total Trades"
                        value={account.totalTrades.toString()}
                        icon={Hash}
                    />
                    <MetricCard
                        label="Open Positions"
                        value={account.trades.filter(t => !t.closeTime).length.toString()}
                        icon={TrendingUp}
                        active={account.trades.some(t => !t.closeTime)}
                    />
                    <MetricCard
                        label="Closed Positions"
                        value={account.trades.filter(t => t.closeTime).length.toString()}
                        icon={CheckCircle}
                    />
                </div>
            </div>
        );
    }

    /* --- NO ACCOUNT (SELECTION) VIEW --- */
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-8 ios-glass rounded-[2rem]"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Start Challenge
                    </h2>
                    <p className="text-zinc-400 font-medium max-w-lg">
                        Select an account size to begin your evaluation immediately.
                    </p>
                </div>
                <Button
                    onClick={() => startChallenge(selectedSize)}
                    className="w-full md:w-auto px-8 py-4 bg-[var(--color-gold)] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95"
                >
                    Start {(selectedSize / 1000).toFixed(0)}K Challenge <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ACCOUNT_SIZES.map((size) => {
                    const isSelected = selectedSize === size;
                    const planInfo = PLANS_SUMMARY.find(p => p.size === size);

                    return (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
                                relative p-6 rounded-2xl border text-left transition-all duration-300
                                ${isSelected
                                    ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
                            `}
                        >
                            <div className={`mb-4 w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-[var(--color-gold)] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                <Hash className="w-5 h-5" />
                            </div>
                            <h3 className={`text-3xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                ${(size / 1000).toFixed(0)}K
                            </h3>
                            <p className={`text-sm font-medium ${isSelected ? 'text-[var(--color-gold)]' : 'text-zinc-500'}`}>
                                {planInfo?.title || 'Account'}
                            </p>

                            {isSelected && (
                                <motion.div
                                    layoutId="selected-ring"
                                    className="absolute inset-0 border-2 border-[var(--color-gold)] rounded-2xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}

interface MetricCardProps {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    subValue?: string;
    active?: boolean;
}

function MetricCard({ label, value, icon: Icon, subValue, active }: MetricCardProps) {
    return (
        <div className={`p-5 rounded-2xl border ${active ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{label}</p>
                <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-zinc-600'}`} />
            </div>
            <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
            {subValue && (
                <p className="text-zinc-500 text-xs mt-1 font-medium">{subValue}</p>
            )}
        </div>
    );
}
