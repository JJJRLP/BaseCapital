"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, TrendingUp, Trophy, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    icon: React.ElementType;
    recommended?: boolean;
    highlightedFeatures?: string[];
}

const plans: Plan[] = [
    {
        id: "starter",
        name: "Starter",
        price: "$49.99",
        description: "Start your journey with a $5,000 account.",
        icon: TrendingUp,
        features: [
            "$5,000 Virtual Capital",
            "8% Profit Target",
            "8% Max Drawdown",
            "5 Minimum Trading Days",
            "Refundable Fee",
        ],
    },
    {
        id: "professional",
        name: "Professional",
        price: "$159.99",
        description: "Step up with a $20,000 account.",
        icon: Trophy,
        features: [
            "$20,000 Virtual Capital",
            "8% Profit Target",
            "8% Max Drawdown",
            "5 Minimum Trading Days",
            "Refundable Fee",
            "Priority Support",
        ],
        highlightedFeatures: ["Priority Support"],
        recommended: true,
    },
    {
        id: "executive",
        name: "Executive",
        price: "$299.99",
        description: "Maximize potential with a $50,000 account.",
        icon: Crown,
        features: [
            "$50,000 Virtual Capital",
            "8% Profit Target",
            "8% Max Drawdown",
            "5 Minimum Trading Days",
            "Refundable Fee",
            "Dedicated Support",
            "80% Profit Split"
        ],
        highlightedFeatures: ["80% Profit Split", "Dedicated Support"],
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
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-all duration-500"
                    />

                    {/* Modal Container */}
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

                            <div className="text-center mb-12 mt-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">
                                        Select Your <span className="font-script text-[var(--color-gold)]">Tier</span>
                                    </h2>
                                    <p className="text-zinc-400 font-light text-lg max-w-2xl mx-auto">
                                        Choose the capital allocation that fits your trading goals.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-8 pb-12 items-stretch">
                                {plans.map((plan, index) => {
                                    const isRecommended = plan.recommended;
                                    const Icon = plan.icon;

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${isRecommended
                                                ? "bg-zinc-900 border border-[var(--color-gold)] shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] z-20 scale-105"
                                                : "bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 z-10"
                                                }`}
                                        >
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isRecommended
                                                ? "bg-[var(--color-gold)] text-black"
                                                : "bg-zinc-900 text-white border border-zinc-800"
                                                }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            {/* Title & Description */}
                                            <div className="mb-8">
                                                <h3 className={`text-2xl font-medium mb-2 ${isRecommended ? "text-white" : "text-white"}`}>
                                                    {plan.name}
                                                </h3>
                                                <p className="text-zinc-400 text-sm leading-relaxed min-h-[40px]">
                                                    {plan.description}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-8">
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Starting at</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-4xl font-semibold tracking-tight ${isRecommended ? "text-white" : "text-white"}`}>
                                                        {plan.price}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Button
                                                onClick={() => onSelectPlan(plan.id)}
                                                className={`w-full py-6 text-sm font-medium tracking-wide mb-8 flex items-center justify-center gap-2 ${isRecommended
                                                    ? "bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90"
                                                    : "bg-white text-black hover:bg-zinc-200"
                                                    }`}
                                            >
                                                Select Plan <ArrowRight className="w-4 h-4" />
                                            </Button>

                                            {/* Features */}
                                            <div className="flex-1">
                                                <p className="text-xs text-zinc-500 font-medium mb-4 uppercase tracking-wider">Plan Includes:</p>
                                                <ul className="space-y-3">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm">
                                                            <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${isRecommended ? "bg-zinc-800 text-[var(--color-gold)]" : "bg-zinc-900 text-zinc-400"
                                                                }`}>
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                            <span className="text-zinc-300">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
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
