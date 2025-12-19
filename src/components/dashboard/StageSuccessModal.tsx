"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import confetti from 'canvas-confetti';

export function StageSuccessModal() {
    const { account, advanceToNextStage } = useEvaluation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (account?.status === 'passed') {
            setIsOpen(true);
            // Trigger confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: ReturnType<typeof setInterval> = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        } else {
            setIsOpen(false);
        }
    }, [account?.status]);

    const handleAdvance = () => {
        advanceToNextStage();
        setIsOpen(false);
    };

    if (!isOpen || !account) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-xl border border-yellow-500/30 bg-zinc-900 shadow-2xl"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/5" />
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative p-8 text-center">
                        <div className="mx-auto mb-6 w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                            <Trophy className="w-10 h-10 text-yellow-500" />
                        </div>

                        <h2 className="text-3xl font-light text-white mb-2">
                            Stage Passed!
                        </h2>
                        <p className="text-zinc-400 mb-8">
                            Congratulations! You have successfully completed the <span className="text-white font-medium capitalize">{account.stage}</span> stage. You are now ready to advance.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Profit Target</span>
                                </div>
                                <p className="text-white font-mono">Hit</p>
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Risk Rules</span>
                                </div>
                                <p className="text-white font-mono">Passed</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleAdvance}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-6 text-lg shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                        >
                            Start Next Stage
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
