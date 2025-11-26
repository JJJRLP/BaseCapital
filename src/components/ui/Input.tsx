import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-700 transition-colors ${className}`}
                {...props}
            />
        </div>
    );
}
