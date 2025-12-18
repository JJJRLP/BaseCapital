"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Lock } from "lucide-react";

const icons = [TrendingUp, Shield, Lock];
import { useLanguage } from "@/contexts/LanguageContext";

export function WhitelistRationale() {
    const { t } = useLanguage();
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">
                        {t.whitelist.title_prefix} <span className="font-script font-thin text-5xl md:text-7xl text-[var(--color-gold)] mx-2 block md:inline mt-4 md:mt-0">{t.whitelist.title_suffix}</span>
                        <span className="block mt-2 md:inline">Rationale</span>
                    </h2>
                    <p className="text-zinc-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
                        {t.whitelist.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {t.whitelist.items.map((feature, index) => {
                        const Icon = icons[index];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
                                className="group ios-glass p-10 rounded-[2.5rem] hover:scale-[1.02] transition-transform duration-300 cursor-default"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md group-hover:bg-[var(--color-gold)]/10 transition-colors">
                                    <Icon className="w-8 h-8 text-white group-hover:text-[var(--color-gold)] transition-colors" />
                                </div>
                                <h3 className="text-2xl text-white font-bold mb-4 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 font-medium leading-relaxed text-lg">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
