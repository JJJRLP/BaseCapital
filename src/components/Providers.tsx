"use client";

import { OnchainProviders } from './OnchainProviders';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EvaluationProvider } from "@/contexts/EvaluationContext";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <OnchainProviders>
            <AuthProvider>
                <LanguageProvider>
                    <EvaluationProvider>
                        {children}
                    </EvaluationProvider>
                </LanguageProvider>
            </AuthProvider>
        </OnchainProviders>
    );
}

