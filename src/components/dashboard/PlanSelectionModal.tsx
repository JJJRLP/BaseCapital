"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, TrendingUp, Trophy, Crown, ArrowRight, ExternalLink, AlertCircle } from "lucide-react";
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
    color: string;
}

const plans: Plan[] = [
    {
        id: "starter",
        contractPlanId: 1,
        name: "Starter",
        price: "$49.99",
        priceUSDC: BigInt(49990000), // 49.99 USDC (6 decimals)
        description: "Perfect for proving your edge with minimal risk.",
        icon: TrendingUp,
        color: "from-blue-500/20 to-blue-600/5",
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
        description: "The standard for serious traders.",
        icon: Trophy,
        recommended: true,
        color: "from-[var(--color-gold)]/20 to-[var(--color-gold)]/5",
        features: [
            "$25,000 Virtual Capital",
            "8% Profit Target",
            "8% Max Drawdown",
            "5 Minimum Trading Days",
            "Refundable Fee",
            "Priority Support",
        ],
    },
    {
        id: "executive",
        contractPlanId: 3,
        name: "Executive",
        price: "$299.99",
        priceUSDC: BigInt(299990000),
        description: "Maximum capital for maximum returns.",
        icon: Crown,
        color: "from-purple-500/20 to-purple-600/5",
        features: [
            "$50,000 Virtual Capital",
            "8% Profit Target",
            "8% Max Drawdown",
            "5 Minimum Trading Days",
            "Refundable Fee",
            "Dedicated Support",
            "80% Profit Split"
        ],
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
            setTimeout(() => {
                onSelectPlan(selectedPlan.id);
            }, 2000);
        }
    }, [selectedPlan, onSelectPlan]);

    const handleError = useCallback(() => {
        setPaymentState('error');
    }, []);

    const handleOffchainSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        onSelectPlan(plan.id);
    };

    const handleClose = () => {
        setSelectedPlan(null);
        setPaymentState('idle');
        setTxHash(null);
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto font-sans">
                    {/* iOS Blur Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isForced ? handleClose : undefined}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-all duration-500"
                    />

                    {/* Modal Container */}
                    <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-7xl z-10 flex flex-col"
                        >
                            {!isForced && (
                                <button
                                    onClick={handleClose}
                                    className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}

                            <div className="text-center mb-12 mt-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-4xl md:text-6xl font-semibold text-white mb-4 tracking-tighter">
                                        Choose Your <span className="font-script text-[var(--color-gold)] font-thin text-5xl md:text-7xl ml-2">Tier</span>
                                    </h2>
                                    <p className="text-zinc-400 font-medium text-lg max-w-2xl mx-auto">
                                        Select an allocation size to begin your evaluation.
                                    </p>

                                    {/* On-chain payment notice */}
                                    {contractsDeployed && isConnected && (
                                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-md">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-blue-100 text-sm font-medium">On-Chain • USDC</span>
                                        </div>
                                    )}

                                    {!contractsDeployed && (
                                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full backdrop-blur-md">
                                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                                            <span className="text-yellow-100 text-sm font-medium">Dev Mode • Local</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-8 pb-12 items-stretch">
                                {plans.map((plan, index) => {
                                    const isRecommended = plan.recommended;
                                    const Icon = plan.icon;
                                    const isSelected = selectedPlan?.id === plan.id;

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                                            onClick={() => !contractsDeployed && handleOffchainSelect(plan)}
                                            className={`
                                                relative flex flex-col rounded-[2rem] p-8 transition-all duration-300
                                                ios-glass group cursor-pointer
                                                ${isRecommended ? "scale-105 z-20 shadow-[0_0_50px_-20px_rgba(212,175,55,0.3)] ring-1 ring-[var(--color-gold)]/50" : "z-10 hover:scale-[1.02]"}
                                                ${isSelected ? "ring-2 ring-blue-500" : ""}
                                            `}
                                        >
                                            {/* Gradient Background Wash */}
                                            <div className={`absolute inset-0 rounded-[2rem] opacity-20 bg-gradient-to-br ${plan.color} pointer-events-none`} />

                                            {/* Icon */}
                                            <div className={`
                                                w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg backdrop-blur-md
                                                bg-white/10 border border-white/5
                                            `}>
                                                <Icon className="w-7 h-7" />
                                            </div>

                                            {/* Header */}
                                            <div className="mb-8 relative">
                                                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                                    {plan.name}
                                                </h3>
                                                <p className="text-zinc-400 text-base font-medium leading-relaxed">
                                                    {plan.description}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-8 relative">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-5xl font-bold tracking-tighter text-white">
                                                        {plan.price}
                                                    </span>
                                                    {contractsDeployed && (
                                                        <span className="text-sm font-bold text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md ml-2">USDC</span>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Features */}
                                            <div className="flex-1 relative mb-8">
                                                <ul className="space-y-4">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-4 text-sm font-medium">
                                                            <div className="mt-0.5 p-0.5 rounded-full bg-white/10 text-white shrink-0 backdrop-blur-sm">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                            <span className="text-zinc-300">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Action Button */}
                                            <div className="relative mt-auto">
                                                {contractsDeployed && isConnected ? (
                                                    <Transaction
                                                        chainId={ACTIVE_CHAIN_ID}
                                                        calls={buildTransactionCalls(plan)}
                                                        onSuccess={handleSuccess}
                                                        onError={handleError}
                                                    >
                                                        <TransactionButton
                                                            className={`w-full py-4 text-base font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${isRecommended
                                                                    ? "bg-[var(--color-gold)] text-black shadow-lg shadow-[var(--color-gold)]/20"
                                                                    : "bg-white text-black hover:bg-zinc-200"
                                                                }`}
                                                            text={`Select ${plan.name}`}
                                                        />
                                                        <TransactionStatus>
                                                            <TransactionStatusLabel />
                                                            <TransactionStatusAction />
                                                        </TransactionStatus>
                                                    </Transaction>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleOffchainSelect(plan)}
                                                        className={`w-full py-6 text-base font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${isRecommended
                                                                ? "bg-[var(--color-gold)] text-black shadow-lg shadow-[var(--color-gold)]/20"
                                                                : "bg-white text-black hover:bg-zinc-200"
                                                            }`}
                                                    >
                                                        Get Started <ArrowRight className="w-5 h-5" />
                                                    </Button>
                                                )}
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
                                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="ios-glass rounded-3xl p-10 max-w-md text-center m-4 shadow-2xl"
                                        >
                                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                                <Check className="w-10 h-10 text-green-500" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-3">All Set!</h3>
                                            <p className="text-zinc-300 font-medium mb-8 leading-relaxed">
                                                Your challenge account has been successfully created. Welcome to Base Capital.
                                            </p>
                                            {txHash && (
                                                <a
                                                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-4 py-2 rounded-full transition-colors"
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
