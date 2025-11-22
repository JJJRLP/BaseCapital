"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const offers = [
    {
        title: "Evaluation Model",
        description: "A simple, subscription-based assessment to prove your skills. Pass the benchmark, get funded. No hidden rules.",
        highlight: true,
    },
    {
        title: "Instant USDC Payouts",
        description: "Withdraw your profit share instantly. No waiting for bank wires or processing days.",
        highlight: false,
    },
    {
        title: "Raw Spreads",
        description: "Direct market access pricing. Trade the real market conditions you're used to.",
        highlight: false,
    },
    {
        title: "Institutional Liquidity",
        description: "Deep liquidity pools on Base. Execute large orders with minimal slippage.",
        highlight: false,
    },
];

export function Offer() {
    return (
        <section className="py-32 px-6 bg-[#0a0a0a] relative">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/3 sticky top-32"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-8">
                            The <span className="font-script text-6xl md:text-7xl text-[var(--color-gold)] block mt-2">Offer</span>
                        </h2>
                        <p className="text-zinc-400 text-lg font-light mb-10 leading-relaxed">
                            We provide the capital. You provide the edge.
                            Our infrastructure is built for professionals who demand precision.
                        </p>
                        <Button size="lg" className="w-full md:w-auto">
                            Apply for Evaluation
                        </Button>
                    </motion.div>

                    <div className="md:w-2/3 w-full grid gap-6">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`p-8 border ${offer.highlight
                                        ? "border-zinc-700 bg-zinc-900/40"
                                        : "border-zinc-900 bg-transparent hover:border-zinc-800"
                                    } transition-all duration-300`}
                            >
                                <h3 className="text-2xl text-white font-light mb-3">{offer.title}</h3>
                                <p className="text-zinc-400 font-light">{offer.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
