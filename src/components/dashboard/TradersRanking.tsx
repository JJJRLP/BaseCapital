"use client";

import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

const traders = [
    { rank: 1, name: "Alex M.", profit: "+$45,230", return: "145%", country: "🇬🇧" },
    { rank: 2, name: "Sarah K.", profit: "+$38,100", return: "122%", country: "🇺🇸" },
    { rank: 3, name: "Dimitri V.", profit: "+$32,450", return: "98%", country: "🇷🇺" },
    { rank: 4, name: "Yuki T.", profit: "+$28,900", return: "85%", country: "🇯🇵" },
    { rank: 5, name: "Marcus J.", profit: "+$25,120", return: "76%", country: "🇩🇪" },
];

export function TradersRanking() {
    return (
        <div className="bg-zinc-900/30 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[var(--color-gold)]" />
                    Performance Rankings
                </h2>
                <button className="text-xs text-[var(--color-gold)] hover:underline uppercase tracking-wider">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-zinc-800">
                            <th className="pb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-16">Rank</th>
                            <th className="pb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Trader</th>
                            <th className="pb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Total Profit</th>
                            <th className="pb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Return</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {traders.map((trader, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group hover:bg-zinc-900/50 transition-colors"
                            >
                                <td className="py-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm ${index === 0 ? "bg-[var(--color-gold)] text-black" :
                                        index === 1 ? "bg-zinc-400 text-black" :
                                            index === 2 ? "bg-amber-700 text-white" :
                                                "text-zinc-500"
                                        }`}>
                                        {trader.rank}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{trader.country}</span>
                                        <span className="text-zinc-300 font-light group-hover:text-white transition-colors">{trader.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right text-green-400 font-light">{trader.profit}</td>
                                <td className="py-4 text-right text-white font-medium">{trader.return}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
