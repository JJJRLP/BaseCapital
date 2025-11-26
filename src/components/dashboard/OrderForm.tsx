"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEvaluation } from "@/contexts/EvaluationContext";

export function OrderForm() {
    const { placeTrade, account } = useEvaluation();
    const [orderType, setOrderType] = useState<"market" | "limit">("market");
    const [lots, setLots] = useState<string>("1");
    const [price, setPrice] = useState<string>("64000"); // Simulated price

    const handleTrade = (side: "buy" | "sell") => {
        if (!account) return;
        placeTrade("BTCUSD", side, parseFloat(lots), parseFloat(price));
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 h-full flex flex-col">
            <h2 className="text-lg font-light text-white mb-6 uppercase tracking-wider">Place Order</h2>

            {/* Order Type Selector */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                    onClick={() => setOrderType("market")}
                    className={`py-2 text-xs uppercase tracking-wider transition-colors ${orderType === "market"
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    Market
                </button>
                <button
                    onClick={() => setOrderType("limit")}
                    className={`py-2 text-xs uppercase tracking-wider transition-colors ${orderType === "limit"
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    Limit
                </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 flex-1">
                <Input
                    label="Lots"
                    placeholder="1.00"
                    type="number"
                    value={lots}
                    onChange={(e) => setLots(e.target.value)}
                />
                <Input
                    label="Price (USD)"
                    placeholder="64000.00"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <div className="pt-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Available Balance</span>
                        <span className="text-white">
                            {account ? `$${account.currentBalance.toLocaleString()}` : '-'}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Leverage</span>
                        <span className="text-[var(--color-gold)]">100x</span>
                    </div>
                </div>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                    onClick={() => handleTrade("buy")}
                    disabled={!account}
                    className="w-full bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy / Long
                </Button>
                <Button
                    onClick={() => handleTrade("sell")}
                    disabled={!account}
                    className="w-full bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sell / Short
                </Button>
            </div>
        </div>
    );
}
