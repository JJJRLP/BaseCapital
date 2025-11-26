"use client";

import { motion } from "framer-motion";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { X } from "lucide-react";
import { useState } from "react";

export function PositionsTable() {
    const { account, closeTrade } = useEvaluation();
    const [closePrice, setClosePrice] = useState<Record<string, string>>({});

    if (!account) return null;

    const openTrades = account.trades.filter(t => !t.closeTime);

    const handleCloseTrade = (tradeId: string) => {
        const price = closePrice[tradeId] || "64000"; // Default close price
        closeTrade(tradeId, parseFloat(price));
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-light text-zinc-400 uppercase tracking-wider">Open Positions</h3>
                <span className="text-xs text-zinc-500">{openTrades.length} position{openTrades.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-zinc-800">
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Symbol</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Side</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Lots</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Entry</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Close Price</th>
                            <th className="pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {openTrades.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-zinc-500 text-sm">
                                    No open positions
                                </td>
                            </tr>
                        ) : (
                            openTrades.map((trade, index) => (
                                <motion.tr
                                    key={trade.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group hover:bg-zinc-900/50 transition-colors"
                                >
                                    <td className="py-3 text-sm font-medium text-white">{trade.symbol}</td>
                                    <td className={`py-3 text-xs font-bold uppercase ${trade.type === "buy" ? "text-emerald-500" : "text-rose-500"}`}>
                                        {trade.type === "buy" ? "Long" : "Short"}
                                    </td>
                                    <td className="py-3 text-sm text-zinc-300 text-right">{trade.lots}</td>
                                    <td className="py-3 text-sm text-zinc-300 text-right">${trade.openPrice.toLocaleString()}</td>
                                    <td className="py-3 text-sm text-zinc-300 text-right">
                                        <input
                                            type="number"
                                            className="bg-zinc-800 border border-zinc-700 px-2 py-1 w-24 text-right text-sm"
                                            placeholder="64000"
                                            value={closePrice[trade.id] || ""}
                                            onChange={(e) => setClosePrice({ ...closePrice, [trade.id]: e.target.value })}
                                        />
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => handleCloseTrade(trade.id)}
                                            className="px-3 py-1 bg-rose-500/10 border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
                                        >
                                            Close
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
