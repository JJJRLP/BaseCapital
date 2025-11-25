"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Shield, Zap, BarChart2, Globe } from "lucide-react";

interface NoSubscriptionStateProps {
    onViewPlans: () => void;
}

export function NoSubscriptionState({ onViewPlans }: NoSubscriptionStateProps) {
    const benefits = [
        {
            icon: BarChart2,
            title: "Advanced Trading Tools",
            description: "Access professional-grade charts and indicators."
        },
        {
            icon: Zap,
            title: "Instant Execution",
            description: "Lightning-fast order execution with zero slippage."
        },
        {
            icon: Shield,
            title: "Secure & Regulated",
            description: "Your funds are protected by top-tier security protocols."
        },
        {
            icon: Globe,
            title: "Global Access",
            description: "Trade from anywhere in the world with 24/7 support."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
            >
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                    Unlock Your <span className="font-script text-[var(--color-gold)]">Potential</span>
                </h2>
                <p className="text-xl text-zinc-400 font-light mb-12 max-w-2xl mx-auto">
                    You are one step away from accessing the most powerful proprietary trading platform.
                    Subscribe now to start your journey.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl text-left hover:border-[var(--color-gold)]/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-gold)]/10 transition-colors">
                                <benefit.icon className="w-6 h-6 text-[var(--color-gold)]" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">{benefit.title}</h3>
                            <p className="text-sm text-zinc-500">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        onClick={onViewPlans}
                        size="lg"
                        className="bg-[var(--color-gold)] text-black hover:bg-amber-400 font-bold px-12 py-4 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        View Subscription Plans
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
