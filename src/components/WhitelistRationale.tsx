"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Lock } from "lucide-react";

const icons = [TrendingUp, Shield, Lock];
import { useLanguage } from "@/contexts/LanguageContext";

export function WhitelistRationale() {
    const { t } = useLanguage();
    return (
        <section className="py-20 md:py-32 px-6 bg-[#050505] relative overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 md:mb-20 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
                        {t.whitelist.title_prefix} <span className="font-script text-5xl md:text-6xl text-[var(--color-gold)] mx-2 block md:inline mt-2 md:mt-0">{t.whitelist.title_suffix}</span> Rationale
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
                        {t.whitelist.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.whitelist.items.map((feature, index) => {
                        const Icon = icons[index];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="group p-8 border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors duration-500"
                            >
                                <Icon className="w-8 h-8 text-[var(--color-gold)] mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] group-hover:text-[#F3E5AB] group-hover:drop-shadow-[0_0_20px_rgba(243,229,171,0.6)] transition-all duration-500" />
                                <h3 className="text-xl text-white font-medium mb-4 tracking-wide uppercase text-sm">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 font-light leading-relaxed">
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
