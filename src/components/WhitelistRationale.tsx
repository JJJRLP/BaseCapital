"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Lock } from "lucide-react";

const features = [
    {
        title: "Professional Career Path",
        description: "We don't just fund traders; we build careers. Prove your consistency and scale your capital allocation up to $2M.",
        icon: TrendingUp,
    },
    {
        title: "Global Settlements",
        description: "Bypass banking friction. Receive payouts in USDC anywhere in the world, instantly and securely on Base.",
        icon: Shield,
    },
    {
        title: "Frictionless Capital",
        description: "No wire delays. No geographic restrictions. Pure meritocracy powered by blockchain infrastructure.",
        icon: Lock,
    },
];

export function WhitelistRationale() {
    return (
        <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
                        The <span className="font-script text-5xl md:text-6xl text-[var(--color-gold)] mx-2">Whitelist</span> Rationale
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
                        Trading is a profession, not a gamble. We provide the infrastructure, capital, and global reach for you to succeed.
                        Access is gated to ensure we partner with serious professionals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group p-8 border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors duration-500"
                        >
                            <feature.icon className="w-8 h-8 text-zinc-500 mb-6 group-hover:text-white transition-colors duration-500" />
                            <h3 className="text-xl text-white font-medium mb-4 tracking-wide uppercase text-sm">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
