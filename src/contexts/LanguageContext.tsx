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
    whitelist: {
        title_prefix: string;
        title_suffix: string;
        description: string;
        items: {
            title: string;
            description: string;
        }[];
    };
    footer: {
        rights: string;
        privacy: string;
        terms: string;
        risk: string;
        developed_by: string;
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
            cta_primary: "Join Waitlist",
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
            cta: "Join Waitlist",
            items: [
                {
                    title: "Priority Access",
                    description:
                        "Limited spots available for the next cohort. Secure your position in the line for capital allocation.",
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
        whitelist: {
            title_prefix: "The",
            title_suffix: "Whitelist",
            description:
                "Trading is a profession, not a gamble. We provide the infrastructure, capital, and global reach for you to succeed. Access is gated to ensure we partner with serious professionals.",
            items: [
                {
                    title: "Professional Career Path",
                    description:
                        "We don't just fund traders; we build careers. Prove your consistency and scale your capital allocation up to $2M.",
                },
                {
                    title: "Global Settlements",
                    description:
                        "Bypass banking friction. Receive payouts in USDC anywhere in the world, instantly and securely on Base.",
                },
                {
                    title: "Frictionless Capital",
                    description:
                        "No wire delays. No geographic restrictions. Pure meritocracy powered by blockchain infrastructure.",
                },
            ],
        },
        footer: {
            rights: "BaseCapital",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            risk: "Risk Disclosure",
            developed_by: "Developed and designed by",
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
        whitelist: {
            title_prefix: "La Razón de la",
            title_suffix: "Lista Blanca",
            description:
                "El trading es una profesión, no un juego de azar. Proporcionamos la infraestructura, el capital y el alcance global para que tengas éxito. El acceso está restringido para asegurar que nos asociamos con profesionales serios.",
            items: [
                {
                    title: "Trayectoria Profesional",
                    description:
                        "No solo financiamos traders; construimos carreras. Demuestra tu consistencia y escala tu asignación de capital hasta $2M.",
                },
                {
                    title: "Liquidaciones Globales",
                    description:
                        "Evita la fricción bancaria. Recibe pagos en USDC en cualquier lugar del mundo, al instante y de forma segura en Base.",
                },
                {
                    title: "Capital Sin Fricción",
                    description:
                        "Sin retrasos en transferencias. Sin restricciones geográficas. Pura meritocracia impulsada por infraestructura blockchain.",
                },
            ],
        },
        footer: {
            rights: "BaseCapital",
            privacy: "Política de Privacidad",
            terms: "Términos de Servicio",
            risk: "Divulgación de Riesgos",
            developed_by: "Desarrollado y diseñado por",
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
