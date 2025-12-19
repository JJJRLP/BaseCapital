"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, LineChart, Settings, LogOut, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { NoSubscriptionState } from "@/components/dashboard/NoSubscriptionState";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/app" },
    { icon: LineChart, label: "Trading", href: "/app/trading" },
    { icon: Trophy, label: "Rankings", href: "/app/rankings" },
    { icon: Settings, label: "Settings", href: "/app/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isConnected } = useAccount();
    const { profile, isLoading: isAuthLoading } = useAuth(); // Use AuthContext
    const [hasPlan, setHasPlan] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && profile?.status === "PENDING") {
            router.replace("/waitlist");
        }
    }, [profile, isAuthLoading, router]);

    useEffect(() => {
        // Check local storage for plan
        const savedPlan = localStorage.getItem("skylos_plan");
        if (savedPlan) {
            setHasPlan(true);
        }
        setIsLoading(false);
    }, []);

    const isPlansPage = pathname === "/app/plans";

    const handleViewPlans = () => {
        router.push("/app/plans");
    };

    if (isAuthLoading || (profile?.status === "PENDING")) {
        return null; // Don't render dashboard while checking or redirecting
    }

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 hidden md:flex flex-col">
                <div className="p-6 border-b border-zinc-900">
                    <Link href="/" className="text-2xl font-light tracking-tighter">
                        Skylos <span className="text-[var(--color-gold)] font-script text-3xl">Capital</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-light transition-all duration-300 ${isActive
                                    ? "bg-zinc-900 text-white border-l-2 border-[var(--color-gold)]"
                                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-[var(--color-gold)]" : ""}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-900">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-light text-zinc-500 hover:text-red-500 transition-colors w-full">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-[#050505]/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="md:hidden">
                        {/* Mobile Menu Trigger would go here */}
                        <span className="font-script text-[var(--color-gold)] text-2xl">Skylos</span>
                    </div>
                    <div className="ml-auto">
                        <WalletConnect />
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Gatekeeper Logic */}
                        {/* If loading, show nothing or spinner */}
                        {isLoading ? null : (
                            /* If on plans page, show content (plans) */
                            isPlansPage ? (
                                children
                            ) : (
                                /* Otherwise check connection and plan status */
                                isConnected && !hasPlan ? (
                                    <NoSubscriptionState onViewPlans={handleViewPlans} />
                                ) : (
                                    children
                                )
                            )
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
