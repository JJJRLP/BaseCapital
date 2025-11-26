"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { TradersRanking } from "@/components/dashboard/TradersRanking";
import { AccountSetup } from "@/components/dashboard/AccountSetup";
import { StageSuccessModal } from "@/components/dashboard/StageSuccessModal";
import { motion } from "framer-motion";

export default function AppPage() {
    return (
        <DashboardLayout>
            <StageSuccessModal />
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-light text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400 font-light">
                        Welcome back, Trader. Here is your daily overview.
                    </p>
                </motion.div>

                <AccountSetup />

                <StatsOverview />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Placeholder for Chart/Trading Interface */}
                        <div className="bg-zinc-900/30 border border-zinc-800 p-6 h-[400px] flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <p className="text-zinc-500 font-light uppercase tracking-widest">Trading Chart Area</p>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <TradersRanking />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
