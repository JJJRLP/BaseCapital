"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function QueueCounter({ position }: { position: number }) {
    const [displayPosition, setDisplayPosition] = useState(position + 1200); // Start higher for effect

    // Simulate finding the position
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayPosition(position);
        }, 100);
        return () => clearTimeout(timeout);
    }, [position]);

    const spring = useSpring(position + 500, { mass: 1, stiffness: 75, damping: 15 });

    useEffect(() => {
        spring.set(position);
    }, [position, spring]);

    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    return (
        <div className="text-center py-6 md:py-10">
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.2em] mb-3 font-medium text-balance"
            >
                Global Queue Position
            </motion.p>
            <div className="flex justify-center items-baseline gap-2 md:gap-3 flex-wrap">
                <motion.span
                    className="text-5xl md:text-8xl font-light text-white tracking-tighter tabular-nums text-shadow-glow"
                    initial={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.span>{display}</motion.span>
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-zinc-600 text-lg md:text-2xl font-light"
                >
                    / 50k+
                </motion.span>
            </div>
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100px", opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mt-6"
            />
        </div>
    );
}
