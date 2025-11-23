"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "es" : "en");
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={`z-50 text-xs tracking-widest hover:bg-white/10 ${className}`}
        >
            <span className={language === "en" ? "text-white font-bold" : "text-zinc-500"}>EN</span>
            <span className="mx-2 text-zinc-600">/</span>
            <span className={language === "es" ? "text-white font-bold" : "text-zinc-500"}>ES</span>
        </Button>
    );
}
