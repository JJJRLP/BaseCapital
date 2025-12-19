"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Background } from "@/components/Background";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowRight, Sparkles, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [useMagicLink, setUseMagicLink] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const { signIn, applyForWaitlist, loginWithMagicLink } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            if (isLogin) {
                if (useMagicLink) {
                    // Magic Link Login
                    const result = await loginWithMagicLink(formData.email);
                    if (result.error) {
                        setError(result.error);
                    } else {
                        setSuccess("Check your email for the login link.");
                    }
                } else {
                    // Password Login
                    const result = await signIn(formData.email, formData.password);
                    if (result.error) {
                        setError(result.error);
                    } else {
                        router.push("/app");
                    }
                }
            } else {
                // Apply for Waitlist (Magic Link)
                const result = await applyForWaitlist(formData.email, formData.name);
                if (result.error) {
                    setError(result.error);
                } else {
                    setSuccess("Application received. Check your email to verify and access the portal.");
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden flex lg:items-center justify-center p-4 lg:p-0">
            <Background />
            <FooterLink />

            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Visual Side (Hidden on Mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:flex justify-center"
                >
                    <AuthCard />
                </motion.div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-[420px] mx-auto lg:mx-0"
                >
                    <div className="mb-10">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-fit text-xs font-medium text-zinc-400 mb-6 backdrop-blur-sm"
                        >
                            {isLogin ? "Member Access" : "Waitlist Application"}
                        </motion.div>

                        <h1 className="text-4xl lg:text-5xl font-light text-white mb-4 tracking-tight">
                            {isLogin ? "Welcome" : "Secure Your"} <br />
                            <span className="font-script text-[#D4AF37] text-5xl lg:text-6xl">
                                {isLogin ? "Back" : "Legacy"}
                            </span>
                        </h1>
                        <p className="text-zinc-500 text-lg">
                            {isLogin
                                ? "Access your trading dashboard."
                                : "Join the queue for capital allocation."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        placeholder="Full Name"
                                        label="Legal Name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required={!isLogin}
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-[#D4AF37]/50"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            placeholder="name@example.com"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-zinc-900/50 border-zinc-800 focus:border-[#D4AF37]/50"
                        />

                        <AnimatePresence mode="popLayout">
                            {isLogin && !useMagicLink && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-1"
                                >
                                    <Input
                                        placeholder="••••••••"
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!useMagicLink}
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-[#D4AF37]/50"
                                    />
                                    <div className="text-right">
                                        <button type="button" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot Password?</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setUseMagicLink(!useMagicLink)}
                                    className="text-xs text-[#D4AF37] hover:text-[#b5952f] flex items-center gap-1 transition-colors"
                                >
                                    {useMagicLink ? "Use Password" : "Sign in with Magic Link"} <Sparkles className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg text-sm border ${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}
                            >
                                {error || success}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full text-base py-6 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {isLogin
                                        ? (useMagicLink ? "Send Login Link" : "Enter Portal")
                                        : "Secure Your Spot"}
                                    {useMagicLink || !isLogin ? <Mail className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-zinc-600 text-sm mb-3">
                            {isLogin ? "Not on the list yet?" : "Already verified?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setUseMagicLink(false);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="text-white text-sm font-medium hover:text-[#D4AF37] transition-colors uppercase tracking-wider"
                        >
                            {isLogin ? "Apply for Access" : "Member Login"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
function FooterLink() {
    return (
        <a href="https://skylos.solutions" target="_blank" rel="noopener noreferrer" className="absolute bottom-6 left-6 text-zinc-800 text-xs font-mono uppercase tracking-widest hover:text-zinc-600 transition-colors z-20">
            POWERED BY SKYLOS
        </a>
    );
}
