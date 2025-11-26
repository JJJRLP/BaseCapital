"use client";

import { OnchainProviders } from './OnchainProviders';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EvaluationProvider } from "@/contexts/EvaluationContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <OnchainProviders>
            <LanguageProvider>
                <EvaluationProvider>
                    {children}
                </EvaluationProvider>
            </LanguageProvider>
        </OnchainProviders>
    );
}
