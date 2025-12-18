"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, TrendingUp, Trophy, Crown, ArrowRight, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { encodeFunctionData } from "viem";
import { CONTRACTS, ACTIVE_CHAIN_ID } from "@/lib/contracts";
import { propFirmFactoryABI, erc20ABI } from "@/lib/abis";

interface Plan {
    id: string;
    contractPlanId: number; // On-chain plan ID (1, 2, or 3)
    name: string;
    price: string;
    priceUSDC: bigint; // Price in USDC (6 decimals)
    description: string;
    features: string[];
    icon: React.ElementType;
    recommended?: boolean;
    highlightedFeatures?: string[];
}

const plans: Plan[] = [
    {
        id: "starter",
        contractPlanId: 1,
        name: "Starter",
        price: "$49.99",
        priceUSDC: BigInt(49990000), // 49.99 USDC (6 decimals)
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
        contractPlanId: 2,
        name: "Professional",
        price: "$159.99",
        priceUSDC: BigInt(159990000),
        description: "Step up with a $25,000 account.",
        icon: Trophy,
        features: [
            "$25,000 Virtual Capital",
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
        contractPlanId: 3,
        name: "Executive",
        price: "$299.99",
        priceUSDC: BigInt(299990000),
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

type PaymentState = 'idle' | 'pending' | 'success' | 'error';

export function PlanSelectionModal({ isOpen, onSelectPlan, onClose, isForced = false }: PlanSelectionModalProps) {
    const { address, isConnected } = useAccount();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentState, setPaymentState] = useState<PaymentState>('idle');
    const [txHash, setTxHash] = useState<string | null>(null);

    // Check if contracts are deployed
    const contractsDeployed = CONTRACTS.PROP_FIRM_FACTORY !== '';

    // Build transaction calls for on-chain payment
    const buildTransactionCalls = useCallback((plan: Plan) => {
        if (!address || !contractsDeployed) return [];

        return [
            // Step 1: Approve USDC spending
            {
                to: CONTRACTS.USDC as `0x${string}`,
                data: encodeFunctionData({
                    abi: erc20ABI,
                    functionName: 'approve',
                    args: [CONTRACTS.PROP_FIRM_FACTORY as `0x${string}`, plan.priceUSDC],
                }),
            },
            // Step 2: Start challenge
            {
                to: CONTRACTS.PROP_FIRM_FACTORY as `0x${string}`,
                data: encodeFunctionData({
                    abi: propFirmFactoryABI,
                    functionName: 'startChallenge',
                    args: [BigInt(plan.contractPlanId)],
                }),
            },
        ];
    }, [address, contractsDeployed]);

    // Handle successful transaction
    const handleSuccess = useCallback((response: { transactionReceipts: Array<{ transactionHash: string }> }) => {
        if (response.transactionReceipts.length > 0) {
            setTxHash(response.transactionReceipts[0].transactionHash);
        }
        setPaymentState('success');
        if (selectedPlan) {
            // Notify parent component of successful plan selection
            setTimeout(() => {
                onSelectPlan(selectedPlan.id);
            }, 2000);
        }
    }, [selectedPlan, onSelectPlan]);

    // Handle transaction error
    const handleError = useCallback(() => {
        setPaymentState('error');
    }, []);

    // Handle plan selection (off-chain fallback for development)
    const handleOffchainSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        onSelectPlan(plan.id);
    };

    // Reset state when modal closes
    const handleClose = () => {
        setSelectedPlan(null);
        setPaymentState('idle');
        setTxHash(null);
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isForced ? handleClose : undefined}
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
                                    onClick={handleClose}
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

                                    {/* On-chain payment notice */}
                                    {contractsDeployed && isConnected && (
                                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                            <span className="text-blue-400 text-sm">Powered by Base • Pay with USDC</span>
                                        </div>
                                    )}

                                    {/* Development mode notice */}
                                    {!contractsDeployed && (
                                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                                            <span className="text-yellow-400 text-sm">Development Mode • Contracts Not Deployed</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-8 pb-12 items-stretch">
                                {plans.map((plan, index) => {
                                    const isRecommended = plan.recommended;
                                    const Icon = plan.icon;
                                    const isSelected = selectedPlan?.id === plan.id;

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${isRecommended
                                                ? "bg-zinc-900 border border-[var(--color-gold)] shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] z-20 scale-105"
                                                : "bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 z-10"
                                                } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
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
                                                    {contractsDeployed && (
                                                        <span className="text-xs text-blue-400 ml-2">USDC</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {contractsDeployed && isConnected ? (
                                                // On-chain Transaction Button
                                                <div className="mb-8">
                                                    <Transaction
                                                        chainId={ACTIVE_CHAIN_ID}
                                                        calls={buildTransactionCalls(plan)}
                                                        onSuccess={handleSuccess}
                                                        onError={handleError}
                                                    >
                                                        <TransactionButton
                                                            className={`w-full py-6 text-sm font-medium tracking-wide rounded-lg flex items-center justify-center gap-2 ${isRecommended
                                                                ? "bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90"
                                                                : "bg-white text-black hover:bg-zinc-200"
                                                                }`}
                                                            text={`Pay ${plan.price} USDC`}
                                                        />
                                                        <TransactionStatus>
                                                            <TransactionStatusLabel />
                                                            <TransactionStatusAction />
                                                        </TransactionStatus>
                                                    </Transaction>
                                                </div>
                                            ) : (
                                                // Off-chain fallback button
                                                <Button
                                                    onClick={() => handleOffchainSelect(plan)}
                                                    className={`w-full py-6 text-sm font-medium tracking-wide mb-8 flex items-center justify-center gap-2 ${isRecommended
                                                        ? "bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90"
                                                        : "bg-white text-black hover:bg-zinc-200"
                                                        }`}
                                                >
                                                    Select Plan <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            )}

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

                            {/* Success Modal */}
                            <AnimatePresence>
                                {paymentState === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-zinc-900 border border-green-500/20 rounded-2xl p-8 max-w-md text-center"
                                        >
                                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h3 className="text-2xl font-medium text-white mb-2">Payment Successful!</h3>
                                            <p className="text-zinc-400 mb-4">
                                                Your challenge has been registered on-chain.
                                            </p>
                                            {txHash && (
                                                <a
                                                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    View on Basescan <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
