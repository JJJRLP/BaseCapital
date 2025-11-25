"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Plan {
    id: string;
    name: string;
    price: string;
    features: string[];
    recommended?: boolean;
    description: string;
    highlightedFeatures?: string[];
}

const plans: Plan[] = [
    {
        id: "basic",
        name: "Basic",
        price: "300 USDC",
        description: "Entry-level evaluation for aspiring traders.",
        features: [
            "$50,000 Virtual Capital",
            "Simulated Trading Environment",
            "Basic PnL Targets",
            "Standard Drawdown Limits",
            "No Seed Phrases Needed",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: "1,500 USDC",
        description: "Professional evaluation with higher limits.",
        features: [
            "$100,000 Virtual Capital",
            "Enhanced Drawdown Limits",
            "Priority Support 24/5",
            "Advanced Analytics Suite",
            "Reduced Trading Fees",
            "Access to Pro Tools",
        ],
        highlightedFeatures: ["Enhanced Drawdown Limits", "Priority Support 24/5"],
        recommended: true,
    },
    {
        id: "elite",
        name: "Elite",
        price: "3,000 USDC",
        description: "Maximum capital with revenue share.",
        features: [
            "$250,000 Virtual Capital",
            "Revenue Share Agreement",
            "Dedicated Account Manager",
            "Institutional Grade Data",
            "Zero Trading Fees",
            "Full API Access",
            "VIP Event Access"
        ],
        highlightedFeatures: ["Revenue Share Agreement", "Zero Trading Fees"],
    },
];

interface PlanSelectionModalProps {
    isOpen: boolean;
    onSelectPlan: (planId: string) => void;
    onClose?: () => void;
    isForced?: boolean;
}

export function PlanSelectionModal({ isOpen, onSelectPlan, onClose, isForced = false }: PlanSelectionModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isForced ? onClose : undefined}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-500"
                    />

                    {/* Modal Container for centering */}
                    <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                            className="relative w-full max-w-7xl z-10 flex flex-col"
                        >
                            {!isForced && (
                                <button
                                    onClick={onClose}
                                    className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            )}

                            <div className="text-center mb-10 mt-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">
                                        Select Your <span className="font-script text-[var(--color-gold)]">Tier</span>
                                    </h2>
                                    <p className="text-zinc-400 font-light text-lg max-w-2xl mx-auto">
                                        Scale your trading potential with our tailored capital allocation plans.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Plans Grid - Using items-center for vertical alignment */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center px-4 md:px-8 pb-12">
                                {plans.map((plan, index) => {
                                    const isStarter = plan.id === "basic";
                                    const isPro = plan.id === "pro";
                                    const isElite = plan.id === "elite";

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className={`relative flex flex-col rounded-2xl transition-all duration-300 ${isPro
                                                ? "bg-zinc-900/90 border-2 border-[var(--color-gold)] shadow-[0_0_60px_-15px_rgba(212,175,55,0.3)] z-20 py-12 px-8"
                                                : isElite
                                                    ? "bg-zinc-900/60 border border-zinc-700 hover:border-zinc-500 z-10 py-10 px-8"
                                                    : "bg-zinc-950/40 border border-zinc-800/50 hover:border-zinc-700 opacity-90 hover:opacity-100 py-6 px-6"
                                                }`}
                                        >
                                            {isPro && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
                                                    <div className="bg-[var(--color-gold)] text-black text-xs font-bold px-6 py-1.5 uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Professional Choice
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-center mb-8 pt-2">
                                                <h3 className={`text-xl font-medium mb-2 ${isPro ? "text-[var(--color-gold)]" : "text-white"}`}>
                                                    {plan.name}
                                                </h3>
                                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                                    <span className={`font-light text-white tracking-tighter ${isPro ? "text-5xl" : "text-4xl"}`}>
                                                        {plan.price}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-500 font-light px-2">{plan.description}</p>
                                            </div>

                                            <div className="space-y-4 mb-8 flex-1">
                                                {plan.features.map((feature, i) => {
                                                    const isHighlighted = plan.highlightedFeatures?.some(hf => feature.includes(hf));
                                                    return (
                                                        <div key={i} className="flex items-start gap-3 text-sm">
                                                            <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${isHighlighted ? "bg-[var(--color-gold)] text-black" : "bg-zinc-800 text-zinc-500"}`}>
                                                                <Check className={`w-3 h-3 ${isHighlighted ? "text-black" : "text-zinc-500"}`} />
                                                            </div>
                                                            <span className={`${isHighlighted ? "text-[var(--color-gold)] font-medium" : "text-zinc-300"}`}>
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                onClick={() => onSelectPlan(plan.id)}
                                                className={`w-full text-sm tracking-widest uppercase transition-all duration-300 ${isPro
                                                    ? "bg-[var(--color-gold)] text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] border-none font-bold py-6"
                                                    : "bg-transparent border-zinc-700 hover:border-white text-white hover:bg-white/5 py-4"
                                                    }`}
                                            >
                                                Select {plan.name}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
