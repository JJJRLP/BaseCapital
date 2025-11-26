"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Button } from "@/components/ui/Button";

export function StageTransition() {
    const { account, advanceToNextStage } = useEvaluation();

    if (!account || account.status !== 'passed') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8"
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-light text-white mb-2">
                            Congratulations! You've Passed the {account.stage.charAt(0).toUpperCase() + account.stage.slice(1)} Stage
                        </h2>
                        <p className="text-zinc-400 max-w-xl">
                            You have successfully met all the trading objectives. You are now eligible to proceed to the next stage of your evaluation.
                        </p>

                        <div className="flex gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Profit Target Reached</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Risk Rules Respected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={advanceToNextStage}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-8 py-6 h-auto text-lg shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
                >
                    Start Next Stage
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
}
