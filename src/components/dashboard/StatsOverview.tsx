import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { CONSTANTS, calculateDailyDrawdown } from "@/lib/prop-firm-logic";
import { StageTransition } from "./StageTransition";

export function StatsOverview() {
    const { account, isLoading } = useEvaluation();

    if (isLoading) return null;

    if (!account) {
        return (
            <div className="mb-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm text-center">
                <p className="text-zinc-400">No active evaluation account found.</p>
            </div>
        );
    }

    if (account.status === 'passed') {
        return <StageTransition />;
    }

    const dailyDrawdown = calculateDailyDrawdown(account);
    const profitTarget = account.initialBalance * (CONSTANTS[account.stage.toUpperCase() as keyof typeof CONSTANTS]?.PROFIT_TARGET || 0);
    const profitProgress = profitTarget > 0 ? ((account.currentBalance - account.initialBalance) / profitTarget) * 100 : 0;

    const stats = [
        {
            label: "Account Balance",
            value: `$${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            change: `${((account.currentBalance - account.initialBalance) / account.initialBalance * 100).toFixed(2)}%`,
            isPositive: account.currentBalance >= account.initialBalance,
            icon: DollarSign,
        },
        {
            label: "Equity",
            value: `$${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            change: "Real-time",
            isPositive: true,
            icon: Activity,
        },
        {
            label: "Daily Drawdown",
            value: `-$${Math.abs(dailyDrawdown).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            change: `${(Math.abs(dailyDrawdown) / account.dailyStartingEquity * 100).toFixed(2)}%`,
            isPositive: false,
            icon: TrendingDown,
        },
        {
            label: "Profit Target",
            value: `$${profitTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            change: `${profitProgress.toFixed(1)}% Reached`,
            isPositive: profitProgress >= 0,
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-zinc-900 rounded-sm text-zinc-400">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                            }`}>
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="text-zinc-500 text-sm font-light uppercase tracking-wider mb-1">{stat.label}</h3>
                    <p className="text-2xl text-white font-light">{stat.value}</p>
                </motion.div>
            ))}
        </div>
    );
}
