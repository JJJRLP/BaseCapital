"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Countdown() {
    const { t } = useLanguage();
    // Set target date to 1 month and 2 weeks from now (approx 45 days)
    // For demo purposes, we'll set a fixed future date or calculate it dynamically once
    const [timeLeft, setTimeLeft] = useState({
        days: 45,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        // Target date: 45 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 45);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 md:py-20 px-6 border-y border-zinc-900/50 bg-zinc-900/10 backdrop-blur-sm">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs md:text-sm tracking-[0.3em] uppercase text-zinc-500 mb-8 md:mb-12"
                >
                    {t.countdown.title}
                </motion.h3>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16">
                    <TimeUnit value={timeLeft.days} label={t.countdown.days} />
                    <TimeUnit value={timeLeft.hours} label={t.countdown.hours} />
                    <TimeUnit value={timeLeft.minutes} label={t.countdown.minutes} />
                    <TimeUnit value={timeLeft.seconds} label={t.countdown.seconds} />
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <motion.div
                key={value}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-light text-white tabular-nums font-script" // Using script font for numbers as a stylistic choice, or keep sans for readability. User asked for elite. Let's try sans for readability but maybe gold?
            >
                <span className="font-sans text-white">{value.toString().padStart(2, "0")}</span>
            </motion.div>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-600 mt-2 md:mt-4">{label}</span>
        </div>
    );
}
