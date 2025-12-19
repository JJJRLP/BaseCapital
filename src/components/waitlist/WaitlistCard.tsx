"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

interface WaitlistCardProps {
    name?: string;
    email?: string;
    priority?: boolean;
}

export function WaitlistCard({ name, email, priority = true }: WaitlistCardProps) {
    return (
        <motion.div
            className="relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden ios-glass shadow-2xl group cursor-default select-none bg-black/40"
            initial={{ rotateX: 0, rotateY: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -inset-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] group-hover:opacity-20 opacity-0 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

            {/* Glowing Border effect */}
            <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-500" />

            {/* Content */}
            <div className="p-6 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
                        <User className="text-zinc-200 w-5 h-5" />
                    </div>
                    {priority && (
                        <div className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Priority Pass
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Cardholder</div>
                    <h3 className="text-xl text-white font-medium tracking-tight truncate">{name || "Anonymous Trader"}</h3>
                    <p className="text-zinc-400 text-xs truncate font-mono opacity-60">{email || "No Email Linked"}</p>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-2 w-full mr-8">
                        <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-wider">
                            <span>Verification</span>
                            <span>85%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                            />
                        </div>
                    </div>
                    <div className="text-2xl text-white/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-4.41-8-8s3.59-8 8-8 8 4.41 8 8-4.41 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
