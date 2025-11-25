"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageTransition } from "@/components/ui/PageTransition";
import { PlanSelectionModal } from "@/components/dashboard/PlanSelectionModal";
import { motion } from "framer-motion";
import { Bell, Lock, Shield, User, Wallet, CreditCard } from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "subscription", label: "Subscription", icon: CreditCard },
        { id: "preferences", label: "Preferences", icon: Bell },
    ];

    const handleUpgrade = (planId: string) => {
        console.log("Upgrading to:", planId);
        setShowUpgradeModal(false);
        // Handle upgrade logic here
    };

    return (
        <DashboardLayout>
            <PageTransition>
                <PlanSelectionModal
                    isOpen={showUpgradeModal}
                    onSelectPlan={handleUpgrade}
                    onClose={() => setShowUpgradeModal(false)}
                />

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
                        <p className="text-zinc-400 font-light">
                            Manage your account settings and preferences.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="md:col-span-1 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 border-l-2 ${activeTab === tab.id
                                        ? "bg-zinc-900 text-white border-[var(--color-gold)]"
                                        : "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/30"
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[var(--color-gold)]" : ""}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-3">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-zinc-900/30 border border-zinc-800 p-8"
                            >
                                {activeTab === "profile" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Profile Information</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input label="First Name" defaultValue="Alex" />
                                                <Input label="Last Name" defaultValue="Mercer" />
                                                <Input label="Email Address" defaultValue="alex.mercer@example.com" type="email" />
                                                <Input label="Phone Number" defaultValue="+1 (555) 000-0000" />
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Public Profile</h2>
                                            <div className="space-y-6">
                                                <Input label="Display Name" defaultValue="AlexTrader99" />
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                                                        AM
                                                    </div>
                                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button>Save Changes</Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Password</h2>
                                            <div className="space-y-4 max-w-md">
                                                <Input label="Current Password" type="password" />
                                                <Input label="New Password" type="password" />
                                                <Input label="Confirm New Password" type="password" />
                                            </div>
                                            <div className="mt-4">
                                                <Button>Update Password</Button>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Two-Factor Authentication</h2>
                                            <div className="flex items-start justify-between p-4 bg-zinc-900/50 border border-zinc-800">
                                                <div className="flex gap-4">
                                                    <div className="p-3 bg-zinc-800 rounded-full">
                                                        <Shield className="w-6 h-6 text-[var(--color-gold)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-medium mb-1">Authenticator App</h3>
                                                        <p className="text-sm text-zinc-400">Secure your account with 2FA.</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">Enable</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "subscription" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Current Plan</h2>
                                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-light text-white">Basic Evaluation</h3>
                                                        <p className="text-zinc-500 text-sm">300 USDC • One-time Fee</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="space-y-2 mb-6">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Virtual Capital</span>
                                                        <span className="text-white">$50,000</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Status</span>
                                                        <span className="text-white">Evaluation Phase 1</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Button onClick={() => router.push("/app/plans")} className="bg-[var(--color-gold)] text-black hover:bg-amber-400 border-none">
                                                        Upgrade Tier
                                                    </Button>
                                                    <Button variant="outline">View Contract</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "preferences" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Notifications</h2>
                                            <div className="space-y-4">
                                                {['Trade Executions', 'Price Alerts', 'News & Updates', 'Marketing Emails'].map((item) => (
                                                    <div key={item} className="flex items-center justify-between py-2">
                                                        <span className="text-zinc-300">{item}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-gold)]"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </DashboardLayout>
    );
}
