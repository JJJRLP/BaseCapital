"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Background } from "@/components/Background";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const { signIn, signUp } = useAuth();

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
                const result = await signIn(formData.email, formData.password);
                if (result.error) {
                    setError(result.error);
                } else {
                    router.push("/app");
                }
            } else {
                const result = await signUp(formData.email, formData.password, formData.name);
                if (result.error) {
                    setError(result.error);
                } else {
                    setSuccess("Registration successful! Please check your email to verify your account.");
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] relative overflow-hidden px-6">
            <Background />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-light text-white mb-2">
                            {isLogin ? "Welcome Back" : "Start Your Journey"}
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            {isLogin
                                ? "Enter your credentials to access your account"
                                : "Join the elite trading firm today"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <Input
                                placeholder="Full Name"
                                label="Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        )}
                        <Input
                            placeholder="name@example.com"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="••••••••"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isLogin ? "Signing In..." : "Creating Account..."}
                                </>
                            ) : (
                                isLogin ? "Sign In" : "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="text-zinc-500 text-xs uppercase tracking-wider hover:text-white transition-colors"
                        >
                            {isLogin
                                ? "Don't have an account? Sign Up"
                                : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
