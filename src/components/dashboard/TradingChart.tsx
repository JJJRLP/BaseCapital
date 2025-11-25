"use client";

import { motion } from "framer-motion";
import { Maximize2, MoreHorizontal, TrendingUp } from "lucide-react";

export function TradingChart() {
    return (
        <div className="h-full flex flex-col bg-zinc-900/30 border border-zinc-800 relative overflow-hidden group">
            {/* Chart Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-light text-white">BTC/USD</span>
                        <span className="text-xs px-2 py-0.5 bg-[var(--color-gold)] text-black font-bold rounded-sm">PERP</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-emerald-400 font-medium">$64,230.50</span>
                        <span className="text-zinc-500 text-xs">24h Vol: $1.2B</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 hover:text-white transition-colors">
                        <TrendingUp className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chart Area (Placeholder Visualization) */}
            <div className="flex-1 relative w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20">
                {/* Simulated Price Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M0,300 Q100,250 200,280 T400,200 T600,250 T800,150 T1000,180 T1200,100"
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeWidth="2"
                    />
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        d="M0,300 Q100,250 200,280 T400,200 T600,250 T800,150 T1000,180 T1200,100 V400 H0 Z"
                        fill="url(#chartGradient)"
                    />
                </svg>

                {/* Floating Price Tag */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="absolute right-0 top-[25%] bg-[var(--color-gold)] text-black text-xs font-bold px-2 py-1"
                >
                    $64,230.50
                </motion.div>

                {/* Center Message */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-zinc-700 font-light uppercase tracking-[0.2em] text-sm">TradingView Chart Integration</p>
                    </div>
                </div>
            </div>

            {/* Timeframes */}
            <div className="flex items-center gap-1 p-2 border-t border-zinc-800 bg-zinc-900/50">
                {['1m', '5m', '15m', '1h', '4h', 'D', 'W'].map((tf) => (
                    <button key={tf} className="px-3 py-1 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors rounded-sm">
                        {tf}
                    </button>
                ))}
            </div>
        </div>
    );
}
