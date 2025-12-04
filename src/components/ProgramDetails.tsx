"use client";

import { motion } from "framer-motion";

const benefits = [
    {
        title: "Highest Profit Split",
        description: "Earn up to 100% of your profits. We believe in rewarding talent generously.",
    },
    {
        title: "Monthly Salary",
        description: "Qualify for a monthly salary on top of your profit splits.",
    },
    {
        title: "High Leverage",
        description: "Trade with up to 1:100 leverage to maximize your strategy's potential.",
    },
    {
        title: "Growth Plan",
        description: "Scale your account up to $500,000 as you demonstrate consistent performance.",
    },
    {
        title: "Fast Payouts",
        description: "First payout 14 days after funding, then bi-weekly payouts thereafter.",
    },
    {
        title: "Rewards from Day 1",
        description: "Get rewarded even from the first stage of the evaluation.",
    },
];

const specs = [
    { label: "Evaluation", value: "2-Step Process" },
    { label: "Profit Target", value: "8% (Phase 1) / 5% (Phase 2)" },
    { label: "Max Drawdown", value: "10% Absolute" },
    { label: "Daily Drawdown", value: "5% Equity/Balance" },
    { label: "Leverage", value: "1:100" },
    { label: "Min Trading Days", value: "3 Days" },
];

export function ProgramDetails() {
    return (
        <section className="py-12 md:py-24 px-6 bg-[#050505] border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-12 md:mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-light text-white mb-6"
                    >
                        High Stakes <span className="font-script text-[var(--color-gold)]">Program</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-zinc-400 max-w-2xl mx-auto font-light text-lg"
                    >
                        Designed for serious traders who want to scale their career.
                        Pass the evaluation and unlock high-tier funding.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                    {/* Benefits Column */}
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl text-white font-light mb-8 flex items-center gap-3"
                        >
                            <span className="w-8 h-[1px] bg-[var(--color-gold)]"></span>
                            Key Benefits
                        </motion.h3>
                        <div className="grid gap-6">
                            {benefits.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-2.5 shrink-0" />
                                    <div>
                                        <h4 className="text-white text-lg font-normal mb-1">{item.title}</h4>
                                        <p className="text-zinc-500 font-light text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Specs Column */}
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl text-white font-light mb-8 flex items-center gap-3"
                        >
                            <span className="w-8 h-[1px] bg-[var(--color-gold)]"></span>
                            Specifications
                        </motion.h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {specs.map((spec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="p-6 border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 transition-colors"
                                >
                                    <p className="text-zinc-500 text-sm font-light mb-2">{spec.label}</p>
                                    <p className="text-xl text-white font-normal">{spec.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8 p-6 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-sm"
                        >
                            <p className="text-[var(--color-gold)] text-sm font-light leading-relaxed">
                                * Accounts inactive for 30+ days will expire.
                                <br />
                                * Holding trades over weekends is allowed.
                                <br />
                                * News trading is allowed (with restrictions 2 mins around high-impact news).
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
