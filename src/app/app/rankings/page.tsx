"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageTransition } from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import { Trophy, Medal, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

const allTraders = [
    { rank: 1, name: "Alex M.", profit: "+$45,230", return: "145%", country: "🇬🇧", winRate: "68%", trades: 142 },
    { rank: 2, name: "Sarah K.", profit: "+$38,100", return: "122%", country: "🇺🇸", winRate: "62%", trades: 98 },
    { rank: 3, name: "Dimitri V.", profit: "+$32,450", return: "98%", country: "🇷🇺", winRate: "59%", trades: 215 },
    { rank: 4, name: "Yuki T.", profit: "+$28,900", return: "85%", country: "🇯🇵", winRate: "71%", trades: 64 },
    { rank: 5, name: "Marcus J.", profit: "+$25,120", return: "76%", country: "🇩🇪", winRate: "55%", trades: 189 },
    { rank: 6, name: "Elena R.", profit: "+$22,400", return: "72%", country: "🇪🇸", winRate: "60%", trades: 112 },
    { rank: 7, name: "David L.", profit: "+$19,850", return: "68%", country: "🇨🇦", winRate: "58%", trades: 87 },
    { rank: 8, name: "Sophie B.", profit: "+$18,200", return: "65%", country: "🇫🇷", winRate: "63%", trades: 76 },
    { rank: 9, name: "Wei C.", profit: "+$16,500", return: "61%", country: "🇨🇳", winRate: "57%", trades: 134 },
    { rank: 10, name: "Ryan P.", profit: "+$15,100", return: "58%", country: "🇦🇺", winRate: "54%", trades: 92 },
];

export default function RankingsPage() {
    const [timeframe, setTimeframe] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <DashboardLayout>
            <PageTransition>
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-light text-white mb-2 flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-[var(--color-gold)]" />
                                Global Rankings
                            </h1>
                            <p className="text-zinc-400 font-light">
                                Top performing traders across the Skylos platform.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                            {['all', 'month', 'week'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-2 text-sm rounded-md transition-all ${timeframe === t
                                        ? "bg-[var(--color-gold)] text-black font-medium shadow-lg shadow-amber-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                        }`}
                                >
                                    {t === 'all' ? 'All Time' : t === 'month' ? 'This Month' : 'This Week'}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {isLoading ? (
                            [1, 2, 3].map((i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
                        ) : (
                            [allTraders[1], allTraders[0], allTraders[2]].map((trader, i) => (
                                <motion.div
                                    key={trader.rank}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.2 }}
                                    className={`relative p-6 rounded-xl border ${i === 1
                                        ? "bg-gradient-to-b from-[var(--color-gold)]/10 to-zinc-900/50 border-[var(--color-gold)]/30 transform md:-translate-y-4 z-10"
                                        : "bg-zinc-900/30 border-zinc-800"
                                        }`}
                                >
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${i === 1 ? "bg-[var(--color-gold)] text-black" : "bg-zinc-700 text-white"
                                            }`}>
                                            {trader.rank}
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <div className="text-4xl mb-2">{trader.country}</div>
                                        <h3 className="text-xl font-medium text-white mb-1">{trader.name}</h3>
                                        <p className="text-emerald-400 font-bold text-2xl mb-4">{trader.profit}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-zinc-800/50 pt-4">
                                            <div>
                                                <p className="text-zinc-500">Return</p>
                                                <p className="text-white">{trader.return}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500">Win Rate</p>
                                                <p className="text-white">{trader.winRate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Full Table */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search traders..."
                                    className="bg-zinc-900 border border-zinc-800 text-sm text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[var(--color-gold)] w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left bg-zinc-900/50">
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-20">Rank</th>
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Trader</th>
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Total Profit</th>
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Return</th>
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Win Rate</th>
                                        <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Trades</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {isLoading ? (
                                        [1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td colSpan={6} className="px-6 py-4">
                                                    <Skeleton className="h-8 w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        allTraders.slice(3).map((trader, index) => (
                                            <motion.tr
                                                key={trader.rank}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-zinc-900/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-500 font-mono">#{trader.rank}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{trader.country}</span>
                                                        <span className="text-white font-medium">{trader.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-emerald-400 font-medium">{trader.profit}</td>
                                                <td className="px-6 py-4 text-right text-white">{trader.return}</td>
                                                <td className="px-6 py-4 text-right text-zinc-300">{trader.winRate}</td>
                                                <td className="px-6 py-4 text-right text-zinc-300">{trader.trades}</td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </DashboardLayout>
    );
}
