"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export function OrderForm() {
    const [orderType, setOrderType] = useState<"market" | "limit">("market");
    const [side, setSide] = useState<"buy" | "sell">("buy");

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
                <Input label="Size (USD)" placeholder="0.00" type="number" />
                {orderType === "limit" && (
                    <Input label="Price (USD)" placeholder="0.00" type="number" />
                )}

                <div className="pt-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Available Balance</span>
                        <span className="text-white">$50,000.00</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Leverage</span>
                        <span className="text-[var(--color-gold)]">20x</span>
                    </div>
                </div>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                    onClick={() => setSide("buy")}
                    className={`w-full ${side === "buy" ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black" : "opacity-50 grayscale"}`}
                >
                    Buy / Long
                </Button>
                <Button
                    onClick={() => setSide("sell")}
                    className={`w-full ${side === "sell" ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white" : "opacity-50 grayscale"}`}
                >
                    Sell / Short
                </Button>
            </div>
        </div>
    );
}
