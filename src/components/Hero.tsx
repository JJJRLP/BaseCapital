"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Hero() {
    const { t } = useLanguage();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center py-20 md:py-0">
            <LanguageSwitcher className="absolute top-6 right-6 md:top-10 md:right-10" />
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#050505] to-[#050505]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
            </div>

            <motion.div
                style={{ y: y1, opacity }}
                className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 border border-zinc-800 rounded-full text-[10px] md:text-xs tracking-[0.2em] text-zinc-500 uppercase mb-6 backdrop-blur-sm">
                        {t.hero.tag}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-6"
                >
                    {t.hero.title_prefix} <br />
                    <span className="font-script text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-gold-shine ml-2 block sm:inline mt-2 sm:mt-0">{t.hero.title_suffix}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-base md:text-xl text-zinc-400 max-w-xl mx-auto mb-10 font-light leading-relaxed px-4 md:px-0"
                >
                    {t.hero.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button size="lg" className="group">
                        {t.hero.cta_primary}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg">
                        {t.hero.cta_secondary}
                    </Button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">{t.hero.scroll}</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
            </motion.div>
        </section>
    );
}
