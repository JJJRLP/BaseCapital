"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Activity } from "lucide-react";

export function AuthCard() {
    return (
        <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl group select-none">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-black to-zinc-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent opacity-50" />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-3xl" />

            {/* Content */}
            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Access Level</p>
                        <p className="text-white font-medium">Candidate</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-3xl font-light text-white leading-tight">
                        Apply for <br />
                        <span className="font-script text-[#D4AF37] text-4xl">Capital Allocation</span>
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                            <Activity className="w-4 h-4 text-zinc-500" />
                            <span> institutional-grade execution</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                            <Globe className="w-4 h-4 text-zinc-500" />
                            <span>Global liquidity access</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                        <span className="font-winner text-base">BASE CAPITAL</span>
                        <div className="w-12 h-8 rounded bg-gradient-to-br from-[#D4AF37] to-[#8a6e15] opacity-80" />
                    </div>
                </div>
            </div>
        </div>
    );
}
