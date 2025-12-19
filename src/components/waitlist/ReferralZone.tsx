"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReferralZoneProps {
    referralCode?: string;
}

export function ReferralZone({ referralCode = "SKYLOS-VIP-2025" }: ReferralZoneProps) {
    const [copied, setCopied] = useState(false);

    // Generate full URL
    const referralLink = `https://base.capital/join?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTweet = () => {
        const text = `Just secured my priority spot on the @SkylosCapital waitlist. Institutional-grade prop trading is coming to Base. \n\nGet early access: ${referralLink}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="space-y-6 w-full max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-white text-lg font-medium">Boost Your Position</h3>
                <p className="text-zinc-500 text-sm">Invite friends to move up the queue. 5 spots per referral.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 flex items-center pr-2 gap-2 ios-glass-highlight">
                <div className="h-10 px-4 flex items-center text-zinc-400 text-sm bg-black/20 rounded-lg flex-1 truncate font-mono select-all">
                    {referralLink}
                </div>
                <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 p-0 text-white hover:bg-white/10 rounded-lg shrink-0"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <Check className="w-4 h-4 text-green-400" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <Copy className="w-4 h-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={handleTweet}
                    className="w-full py-3 px-4 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                >
                    <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Share on X
                </button>
            </div>
        </div>
    );
}
