"use client";

import { motion } from "framer-motion";

const positions = [
    { symbol: "BTC/USD", size: "0.5 BTC", entry: "$62,100", mark: "$64,230", pnl: "+$1,065", pnlPercent: "+3.4%", side: "Long" },
    { symbol: "ETH/USD", size: "10 ETH", entry: "$3,450", mark: "$3,420", pnl: "-$300", pnlPercent: "-0.8%", side: "Long" },
];

export function PositionsTable() {
    return (
        <div className="bg-zinc-900/30 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-light text-zinc-400 uppercase tracking-wider">Open Positions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-zinc-800">
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Symbol</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Side</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Size</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Entry Price</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Mark Price</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">PnL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {positions.map((pos, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group hover:bg-zinc-900/50 transition-colors"
                            >
                                <td className="py-3 text-sm font-medium text-white">{pos.symbol}</td>
                                <td className={`py-3 text-xs font-bold uppercase ${pos.side === "Long" ? "text-emerald-500" : "text-rose-500"}`}>
                                    {pos.side}
                                </td>
                                <td className="py-3 text-sm text-zinc-300 text-right">{pos.size}</td>
                                <td className="py-3 text-sm text-zinc-300 text-right">{pos.entry}</td>
                                <td className="py-3 text-sm text-zinc-300 text-right">{pos.mark}</td>
                                <td className={`py-3 text-sm font-medium text-right ${pos.pnl.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                                    {pos.pnl} <span className="text-xs opacity-70 ml-1">({pos.pnlPercent})</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
