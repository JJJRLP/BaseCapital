"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Countdown() {
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
        <section className="py-20 px-6 border-y border-zinc-900/50 bg-zinc-900/10 backdrop-blur-sm">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm tracking-[0.3em] uppercase text-zinc-500 mb-12"
                >
                    Next Cohort Opens In
                </motion.h3>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Minutes" />
                    <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-light text-white tabular-nums font-script" // Using script font for numbers as a stylistic choice, or keep sans for readability. User asked for elite. Let's try sans for readability but maybe gold?
            >
                <span className="font-sans text-white">{value.toString().padStart(2, "0")}</span>
            </motion.div>
            <span className="text-xs uppercase tracking-widest text-zinc-600 mt-4">{label}</span>
        </div>
    );
}
