"use client";

import { OnchainProviders } from './OnchainProviders';
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <OnchainProviders>
            <LanguageProvider>{children}</LanguageProvider>
        </OnchainProviders>
    );
}
