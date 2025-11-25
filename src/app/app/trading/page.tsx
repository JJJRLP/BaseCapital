"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TradingChart } from "@/components/dashboard/TradingChart";
import { OrderForm } from "@/components/dashboard/OrderForm";
import { PositionsTable } from "@/components/dashboard/PositionsTable";
import { PageTransition } from "@/components/ui/PageTransition";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TradingPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <DashboardLayout>
            <PageTransition>
                <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-none"
                    >
                        <h1 className="text-2xl font-light text-white">Trading Terminal</h1>
                    </motion.div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
                        {/* Main Chart Area */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-3 flex flex-col gap-4"
                        >
                            <div className="flex-1 min-h-[400px] relative">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <div className="w-full h-full relative">
                                        <TradingChart />
                                        <BorderBeam size={300} duration={10} delay={5} colorFrom="var(--color-gold)" colorTo="transparent" />
                                    </div>
                                )}
                            </div>
                            <div className="h-64">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <PositionsTable />
                                )}
                            </div>
                        </motion.div>

                        {/* Order Form Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            {isLoading ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <OrderForm />
                            )}
                        </motion.div>
                    </div>
                </div>
            </PageTransition>
        </DashboardLayout>
    );
}
