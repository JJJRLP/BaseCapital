"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Background } from "@/components/Background";
import { WaitlistCard } from "@/components/waitlist/WaitlistCard";
import { QueueCounter } from "@/components/waitlist/QueueCounter";
import { ReferralZone } from "@/components/waitlist/ReferralZone";
import { LogOut, ArrowRight, Disc } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaitlistDashboard() {
    const { profile, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col lg:flex-row text-balance">
            <Background />

            {/* Mobile Header / Brand */}
            <div className="lg:hidden absolute top-6 left-6 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full animate-pulse" />
                    <span className="font-winner text-xl text-white tracking-widest">BASE CAPITAL</span>
                </div>
            </div>

            {/* Left Panel - Hero & Card */}
            <section className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 lg:p-20 min-h-[60vh] lg:min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-lg space-y-12"
                >
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                            </span>
                            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Status: Pending</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1]">
                            Welcome to the <br />
                            <span className="font-script text-[#D4AF37] text-5xl md:text-7xl">Inner Circle</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-md mx-auto lg:mx-0 font-light">
                            Your application is currently under review by our risk committee. We are processing batch <span className="text-white font-medium">#42</span>.
                        </p>
                    </div>

                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <WaitlistCard
                            name={profile?.displayName || "Trader"}
                            email={profile?.email || ""}
                        />
                    </div>

                    <div className="hidden lg:flex items-center gap-6 pt-4">
                        <button
                            onClick={handleSignOut}
                            className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
                        </button>
                    </div>
                </motion.div>
                <div className="absolute bottom-6 left-6 text-zinc-800 text-xs font-mono uppercase tracking-widest">
                    BASE CAPITAL /// EST. 2025
                </div>
            </section>

            {/* Right Panel - Stats & Actions */}
            <section className="relative z-10 lg:w-[480px] bg-zinc-950/30 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/5 p-6 lg:p-12 flex flex-col justify-center">
                {/* Decorative top fade for mobile */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />

                <div className="w-full max-w-md mx-auto space-y-12">
                    <QueueCounter position={4821} />

                    <div className="space-y-8">
                        <ReferralZone referralCode="SKH-VIP" />

                        <div className="h-px bg-white/5" />

                        <div className="grid grid-cols-2 gap-4">
                            <a href="https://discord.gg/" target="_blank" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center group">
                                <Disc className="w-6 h-6 text-[#5865F2] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-zinc-400 font-medium">Join Discord</span>
                            </a>
                            <a href="#" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center group">
                                <div className="w-6 h-6 mx-auto mb-2 text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">X</div>
                                <span className="text-xs text-zinc-400 font-medium">Follow</span>
                            </a>
                        </div>
                    </div>

                    <div className="lg:hidden text-center pt-8">
                        <button onClick={handleSignOut} className="text-sm text-zinc-500">Sign Out</button>
                    </div>
                </div>
            </section>
        </main>
    );
}
