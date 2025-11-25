import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends HTMLMotionProps<"input"> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        {label}
                    </label>
                )}
                <motion.input
                    ref={ref}
                    whileFocus={{ scale: 1.01 }}
                    className={cn(
                        "w-full bg-zinc-900/50 border border-zinc-800 text-white px-4 py-3 rounded-none focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all duration-300 placeholder:text-zinc-600",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1 block">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
