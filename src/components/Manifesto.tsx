"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Manifesto() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-gold)]/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-16"
                    >
                        <h2 className="text-5xl md:text-7xl font-semibold text-white mb-8 tracking-tighter">
                            The <span className="text-[var(--color-gold)] font-script font-thin">Manifesto</span>
                        </h2>

                        <div className="ios-glass p-10 md:p-14 rounded-[3rem] mb-12 shadow-2xl backdrop-blur-3xl">
                            <p className="text-zinc-200 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                                "We believe in empowering traders with <span className="text-white font-bold">fair rules</span>, transparent evaluation, and the <span className="text-[var(--color-gold)]">capital they deserve</span>. Our path to funding is designed to identify and reward consistent profitability."
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 mb-16">
                            <div className="flex items-center gap-3 text-white bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <TrendingUp className="w-5 h-5 text-[var(--color-gold)]" />
                                <span className="text-lg font-medium">8% Profit Target</span>
                            </div>
                            <div className="flex items-center gap-3 text-white bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <ShieldCheck className="w-5 h-5 text-[var(--color-gold)]" />
                                <span className="text-lg font-medium">8% Max Drawdown</span>
                            </div>
                        </div>

                        <Link href="/manifesto">
                            <Button
                                variant="outline"
                                className="border-white/10 bg-white/5 text-white px-10 py-6 text-lg rounded-2xl hover:bg-white hover:text-black transition-all duration-300 font-semibold group"
                            >
                                Read Full Manifesto <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
