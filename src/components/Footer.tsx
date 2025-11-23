"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="py-8 px-6 bg-[#050505] border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm gap-6 md:gap-0">
                <div className="order-2 md:order-1">
                    <span className="font-medium text-zinc-500">BaseCapital</span> &copy; {new Date().getFullYear()}
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center order-1 md:order-2">
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-zinc-400 transition-colors">{t.footer.privacy}</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors">{t.footer.terms}</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors">{t.footer.risk}</a>
                    </div>
                    <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
                    <span className="text-xs text-zinc-600 flex items-center">
                        {t.footer.developed_by} <a href="https://skylos.solutions" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-winner)] text-zinc-500 hover:text-zinc-300 transition-colors ml-1 text-sm tracking-widest">SKYLOS</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
