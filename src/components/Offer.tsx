"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";



export function Offer() {
    const { t } = useLanguage();
    return (
        <section className="py-20 md:py-32 px-6 bg-[#0a0a0a] relative">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/3 md:sticky md:top-32"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-8">
                            {t.offer.title_prefix} <span className="font-script text-6xl md:text-7xl text-[var(--color-gold)] block mt-2">{t.offer.title_suffix}</span>
                        </h2>
                        <p className="text-zinc-400 text-lg font-light mb-10 leading-relaxed">
                            {t.offer.description}
                        </p>
                        <Button size="lg" className="w-full md:w-auto">
                            {t.offer.cta}
                        </Button>
                    </motion.div>

                    <div className="md:w-2/3 w-full grid gap-6">
                        {t.offer.items.map((offer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`p-8 border ${index === 0
                                    ? "border-zinc-700 bg-zinc-900/40"
                                    : "border-zinc-900 bg-transparent hover:border-zinc-800"
                                    } transition-all duration-300`}
                            >
                                <h3 className="text-2xl text-white font-light mb-3">{offer.title}</h3>
                                <p className="text-zinc-400 font-light">{offer.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
