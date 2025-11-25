"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Background } from "@/components/Background";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would handle auth here.
        // For now, just redirect to the app.
        router.push("/app");
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <Input
                                placeholder="Full Name"
                                label="Name"
                                type="text"
                                required
                            />
                        )}
                        <Input
                            placeholder="name@example.com"
                            label="Email"
                            type="email"
                            required
                        />
                        <Input
                            placeholder="••••••••"
                            label="Password"
                            type="password"
                            required
                        />

                        <Button type="submit" className="w-full mt-4">
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
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
