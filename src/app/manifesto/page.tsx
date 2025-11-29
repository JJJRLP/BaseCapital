"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, TrendingUp, Wallet, ArrowRight, Target, Clock, Scale } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-[var(--color-gold)] selection:text-black">
            {/* Navigation (Simplified) */}
            <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-light tracking-tighter">
                        BASE<span className="font-bold text-[var(--color-gold)]">CAPITAL</span>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="text-xs">Back to Home</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-gold)]/5 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
                                The <span className="font-script text-[var(--color-gold)]">Manifesto</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
                                We are building the future of proprietary trading. A future defined by transparency, fairness, and the relentless pursuit of excellence.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-zinc-900/30 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-light mb-6">Our Mission</h2>
                                <p className="text-zinc-400 leading-relaxed mb-6">
                                    Trading is hard enough without having to worry about hidden rules or unfair evaluations. At BaseCapital, our mission is simple: identify consistent traders and provide them with the capital they need to succeed.
                                </p>
                                <p className="text-zinc-400 leading-relaxed">
                                    We don't profit from your failure. We profit from your success. That's why our rules are designed to protect capital, not to trip you up.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--color-gold)]/10 blur-3xl rounded-full" />
                                <div className="relative bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-[var(--color-gold)]/10 rounded-xl">
                                            <Target className="w-6 h-6 text-[var(--color-gold)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-2">Aligned Interests</h3>
                                            <p className="text-sm text-zinc-500">We only win when you win.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[var(--color-gold)]/10 rounded-xl">
                                            <Scale className="w-6 h-6 text-[var(--color-gold)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-2">Fair Evaluation</h3>
                                            <p className="text-sm text-zinc-500">Clear rules, no hidden traps.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Process Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-light mb-6">The Evaluation Process</h2>
                            <p className="text-zinc-400">Two phases to prove your skill. One goal: Funding.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Phase 1 */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-[var(--color-gold)]/50 transition-colors"
                            >
                                <div className="absolute -top-6 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none">
                                    <span className="text-[12rem] font-bold text-white leading-none">1</span>
                                </div>
                                <h3 className="text-2xl font-medium text-white mb-2 relative z-10">The Challenge</h3>
                                <p className="text-[var(--color-gold)] font-medium mb-8 relative z-10">Phase 1</p>

                                <ul className="space-y-6 relative z-10">
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Profit Target</span>
                                        <span className="text-2xl font-light text-white">8%</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Min Trading Days</span>
                                        <span className="text-2xl font-light text-white">5 Days</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Max Drawdown</span>
                                        <span className="text-2xl font-light text-white">8%</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-zinc-400">Time Limit</span>
                                        <span className="text-xl font-light text-white flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Unlimited
                                        </span>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Phase 2 */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-[var(--color-gold)]/50 transition-colors"
                            >
                                <div className="absolute -top-6 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none">
                                    <span className="text-[12rem] font-bold text-white leading-none">2</span>
                                </div>
                                <h3 className="text-2xl font-medium text-white mb-2 relative z-10">The Verification</h3>
                                <p className="text-[var(--color-gold)] font-medium mb-8 relative z-10">Phase 2</p>

                                <ul className="space-y-6 relative z-10">
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Profit Target</span>
                                        <span className="text-2xl font-light text-white">5%</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Min Trading Days</span>
                                        <span className="text-2xl font-light text-white">5 Days</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <span className="text-zinc-400">Max Drawdown</span>
                                        <span className="text-2xl font-light text-white">8%</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-zinc-400">Time Limit</span>
                                        <span className="text-xl font-light text-white flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Unlimited
                                        </span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Funded Benefits */}
            <section className="py-24 bg-zinc-900/30 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-light mb-6">The Funded Trader</h2>
                        <p className="text-zinc-400">Once you pass, the real journey begins.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 text-center hover:border-[var(--color-gold)]/30 transition-colors">
                            <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Wallet className="w-8 h-8 text-[var(--color-gold)]" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-4">80% Profit Split</h3>
                            <p className="text-zinc-400 text-sm">You keep the lion's share of your profits. We believe you earned it.</p>
                        </div>
                        <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 text-center hover:border-[var(--color-gold)]/30 transition-colors">
                            <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8 text-[var(--color-gold)]" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-4">Scaling Plan</h3>
                            <p className="text-zinc-400 text-sm">Consistent traders can scale their account size up to $2M in capital.</p>
                        </div>
                        <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 text-center hover:border-[var(--color-gold)]/30 transition-colors">
                            <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-[var(--color-gold)]" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-4">Fee Refund</h3>
                            <p className="text-zinc-400 text-sm">Your initial evaluation fee is refunded with your first payout.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skylos Credit */}
            <section className="py-24">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-zinc-500 font-light mb-8">
                        Designed and developed by <a href="https://skylos.solutions" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] hover:underline font-medium">Skylos</a>.
                    </p>
                    <Link href="/">
                        <Button className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg">
                            Start Your Challenge <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
