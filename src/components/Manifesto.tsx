"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Manifesto() {
    return (
        <section className="py-12 md:py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
                            The <span className="text-[var(--color-gold)] font-script">Manifesto</span>
                        </h2>
                        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8">
                            We believe in empowering traders with fair rules, transparent evaluation, and the capital they deserve.
                            Our path to funding is designed to identify and reward consistent profitability.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                                <TrendingUp className="w-4 h-4 text-[var(--color-gold)]" />
                                <span className="text-sm">8% Profit Target</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                                <ShieldCheck className="w-4 h-4 text-[var(--color-gold)]" />
                                <span className="text-sm">8% Max Drawdown</span>
                            </div>
                        </div>

                        <Link href="/manifesto">
                            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900 text-white px-6 py-4 md:px-8 md:py-6 text-base group">
                                Read Full Manifesto <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
