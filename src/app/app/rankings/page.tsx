"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { useState } from "react";

export default function RankingsPage() {
    const [timeframe, setTimeframe] = useState("all");

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

                    {/* Empty State */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-16 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800/50 flex items-center justify-center">
                            <Users className="w-10 h-10 text-zinc-600" />
                        </div>
                        <h2 className="text-2xl font-light text-white mb-3">
                            Rankings Coming Soon
                        </h2>
                        <p className="text-zinc-400 max-w-md mx-auto mb-6">
                            As traders complete evaluations and begin funded trading,
                            the global leaderboard will populate with top performers.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full text-sm text-zinc-400">
                            <Trophy className="w-4 h-4 text-[var(--color-gold)]" />
                            <span>Be among the first to rank</span>
                        </div>
                    </motion.div>
                </div>
            </PageTransition>
        </DashboardLayout>
    );
}
