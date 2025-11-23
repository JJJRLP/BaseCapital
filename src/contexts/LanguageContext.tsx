"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface Translations {
    hero: {
        tag: string;
        title_prefix: string;
        title_suffix: string;
        description: string;
        cta_primary: string;
        cta_secondary: string;
        scroll: string;
    };
    countdown: {
        title: string;
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    };
    offer: {
        title_prefix: string;
        title_suffix: string;
        description: string;
        cta: string;
        items: {
            title: string;
            description: string;
        }[];
    };
}

const translations: Record<Language, Translations> = {
    en: {
        hero: {
            tag: "Institutional Grade",
            title_prefix: "Capital for the",
            title_suffix: "1% of Traders",
            description:
                "Prove your edge with raw spreads, zero slippage, and deep institutional liquidity.",
            cta_primary: "Request Access",
            cta_secondary: "View Parameters",
            scroll: "Scroll",
        },
        countdown: {
            title: "Next Cohort Opens In",
            days: "Days",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
        },
        offer: {
            title_prefix: "The",
            title_suffix: "Offer",
            description:
                "We provide the capital. You provide the edge. Our infrastructure is built for professionals who demand precision.",
            cta: "Apply for Evaluation",
            items: [
                {
                    title: "Evaluation Model",
                    description:
                        "A simple, subscription-based assessment to prove your skills. Pass the benchmark, get funded. No hidden rules.",
                },
                {
                    title: "Instant USDC Payouts",
                    description:
                        "Withdraw your profit share instantly. No waiting for bank wires or processing days.",
                },
                {
                    title: "Raw Spreads",
                    description:
                        "Direct market access pricing. Trade the real market conditions you're used to.",
                },
                {
                    title: "Institutional Liquidity",
                    description:
                        "Deep liquidity pools on Base. Execute large orders with minimal slippage.",
                },
            ],
        },
    },
    es: {
        hero: {
            tag: "Grado Institucional",
            title_prefix: "Capital para el",
            title_suffix: "1% de Traders",
            description:
                "Demuestra tu ventaja con spreads crudos, cero deslizamiento y profunda liquidez institucional.",
            cta_primary: "Solicitar Acceso",
            cta_secondary: "Ver Parámetros",
            scroll: "Desplazarse",
        },
        countdown: {
            title: "La Próxima Cohorte Abre En",
            days: "Días",
            hours: "Horas",
            minutes: "Minutos",
            seconds: "Segundos",
        },
        offer: {
            title_prefix: "La",
            title_suffix: "Oferta",
            description:
                "Nosotros ponemos el capital. Tú pones la ventaja. Nuestra infraestructura está construida para profesionales que exigen precisión.",
            cta: "Aplicar para Evaluación",
            items: [
                {
                    title: "Modelo de Evaluación",
                    description:
                        "Una evaluación simple basada en suscripción para demostrar tus habilidades. Supera el punto de referencia, obtén fondos. Sin reglas ocultas.",
                },
                {
                    title: "Pagos Instantáneos en USDC",
                    description:
                        "Retira tu participación en las ganancias al instante. Sin esperas por transferencias bancarias o días de procesamiento.",
                },
                {
                    title: "Spreads Crudos",
                    description:
                        "Precios de acceso directo al mercado. Opera en las condiciones reales del mercado a las que estás acostumbrado.",
                },
                {
                    title: "Liquidez Institucional",
                    description:
                        "Piscinas de liquidez profunda en Base. Ejecuta grandes órdenes con un deslizamiento mínimo.",
                },
            ],
        },
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage, t: translations[language] }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
