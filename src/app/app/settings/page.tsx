"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageTransition } from "@/components/ui/PageTransition";
import { PlanSelectionModal } from "@/components/dashboard/PlanSelectionModal";
import { motion } from "framer-motion";
import { Bell, Lock, Shield, User, CreditCard, Loader2, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "wagmi";

export default function SettingsPage() {
    const router = useRouter();
    const { profile, refreshProfile, linkWallet, isLoading: authLoading } = useAuth();
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState("profile");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLinkingWallet, setIsLinkingWallet] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || "",
                email: profile.email,
            });
        }
    }, [profile]);

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "wallets", label: "Wallets", icon: Wallet },
        { id: "security", label: "Security", icon: Lock },
        { id: "subscription", label: "Subscription", icon: CreditCard },
        { id: "preferences", label: "Preferences", icon: Bell },
    ];

    const handleUpgrade = (planId: string) => {
        console.log("Upgrading to:", planId);
        setShowUpgradeModal(false);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName: formData.displayName }),
            });

            if (response.ok) {
                await refreshProfile();
                setSuccessMessage("Profile updated successfully!");
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (error) {
            console.error('Save profile error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLinkWallet = async () => {
        if (!address) return;
        setIsLinkingWallet(true);
        try {
            const result = await linkWallet(address, !profile?.wallets?.length);
            if (!result.error) {
                setSuccessMessage("Wallet linked successfully!");
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } finally {
            setIsLinkingWallet(false);
        }
    };

    const isWalletLinked = profile?.wallets?.some(w => w.address.toLowerCase() === address?.toLowerCase());

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

                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded"
                        >
                            {successMessage}
                        </motion.div>
                    )}

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
                                        {authLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)]" />
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Profile Information</h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Input
                                                            label="Email Address"
                                                            value={formData.email}
                                                            type="email"
                                                            disabled
                                                        />
                                                        <Input
                                                            label="Display Name"
                                                            value={formData.displayName}
                                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Avatar</h2>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                                                            {formData.displayName?.substring(0, 2).toUpperCase() || "??"}
                                                        </div>
                                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                                                        {isSaving ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === "wallets" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-xl font-light text-white mb-6 border-b border-zinc-800 pb-4">Linked Wallets</h2>

                                            {profile?.wallets?.length ? (
                                                <div className="space-y-3 mb-6">
                                                    {profile.wallets.map((wallet) => (
                                                        <div key={wallet.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <Wallet className="w-5 h-5 text-[var(--color-gold)]" />
                                                                <code className="text-white font-mono text-sm">
                                                                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                                                                </code>
                                                                {wallet.isPrimary && (
                                                                    <span className="px-2 py-0.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] text-xs rounded">
                                                                        Primary
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-zinc-500">
                                                    No wallets linked yet.
                                                </div>
                                            )}

                                            {isConnected && !isWalletLinked && (
                                                <Button onClick={handleLinkWallet} disabled={isLinkingWallet}>
                                                    {isLinkingWallet ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Linking...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Wallet className="w-4 h-4 mr-2" />
                                                            Link Connected Wallet
                                                        </>
                                                    )}
                                                </Button>
                                            )}
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
                                            {profile?.subscription ? (
                                                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-2xl font-light text-white">{profile.subscription.planName}</h3>
                                                            <p className="text-zinc-500 text-sm">Started {new Date(profile.subscription.startedAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${profile.subscription.status === 'active'
                                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                                            }`}>
                                                            {profile.subscription.status}
                                                        </span>
                                                    </div>
                                                    {profile.subscription.txHash && (
                                                        <div className="text-sm mb-4">
                                                            <span className="text-zinc-400">Transaction: </span>
                                                            <code className="text-zinc-300 font-mono">
                                                                {profile.subscription.txHash.slice(0, 10)}...{profile.subscription.txHash.slice(-8)}
                                                            </code>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-4">
                                                        <Button onClick={() => router.push("/app/plans")} className="bg-[var(--color-gold)] text-black hover:bg-amber-400 border-none">
                                                            Upgrade Tier
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                                    <p className="text-zinc-400 mb-4">No active subscription</p>
                                                    <Button onClick={() => router.push("/app/plans")} className="bg-[var(--color-gold)] text-black hover:bg-amber-400 border-none">
                                                        View Plans
                                                    </Button>
                                                </div>
                                            )}
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
