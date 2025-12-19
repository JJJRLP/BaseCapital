"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { LogOut, ExternalLink, MessageSquare, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { Background } from "@/components/Background";

export default function WaitlistDashboard() {
    const { profile, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center p-6">
            <Background />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-[var(--color-gold)]/50 blur-[2px]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-[var(--color-gold)]/10 blur-[40px] rounded-full pointing-down" />

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" />
                            Status: Pending Approval
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">
                            Application <span className="font-script text-[var(--color-gold)]">Received</span>
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mx-auto">
                            Welcome, <span className="text-white font-medium">{profile?.displayName}</span>.
                            You are now on the whitelist. We review trader applications on a rolling basis to ensure the highest quality of our capital partners.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <a
                            href="https://discord.gg/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-medium group-hover:text-[var(--color-gold)] transition-colors">Join Discord</h3>
                                <p className="text-zinc-500 text-sm">Meet other traders</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-white transition-colors" />
                        </a>

                        <a
                            href="https://warpcast.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#855DCD]/20 flex items-center justify-center text-[#855DCD]">
                                <Twitter className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-medium group-hover:text-[var(--color-gold)] transition-colors">Follow Updates</h3>
                                <p className="text-zinc-500 text-sm">On Farcaster</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-white transition-colors" />
                        </a>
                    </div>

                    <div className="text-center pt-8 border-t border-zinc-900">
                        <button
                            onClick={handleSignOut}
                            className="text-zinc-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
