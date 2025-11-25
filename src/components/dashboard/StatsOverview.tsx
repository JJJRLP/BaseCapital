"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const stats = [
    {
        label: "Account Balance",
        value: "$102,450.00",
        change: "+2.45%",
        isPositive: true,
        icon: DollarSign,
    },
    {
        label: "Equity",
        value: "$104,120.50",
        change: "+4.12%",
        isPositive: true,
        icon: Activity,
    },
    {
        label: "Daily Drawdown",
        value: "-$1,200.00",
        change: "1.2%",
        isPositive: false, // In this context, negative is "bad" but for drawdown it's usage. Let's keep it simple.
        icon: TrendingDown,
    },
    {
        label: "Profit Target",
        value: "$8,000.00",
        change: "30.6% Reached",
        isPositive: true,
        icon: TrendingUp,
    },
];

export function StatsOverview() {
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
