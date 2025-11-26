"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    TraderAccount,
    Trade,
    checkRules,
    CONSTANTS,
    getNextStage,
    EvaluationStage
} from '@/lib/prop-firm-logic';

interface EvaluationContextType {
    account: TraderAccount | null;
    startChallenge: (size: number) => void;
    placeTrade: (symbol: string, type: 'buy' | 'sell', lots: number, price: number) => void;
    closeTrade: (tradeId: string, price: number) => void;
    resetAccount: () => void;
    advanceToNextStage: () => void;
    isLoading: boolean;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

const STORAGE_KEY = 'prop_firm_account';

export function EvaluationProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<TraderAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setAccount(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored account", e);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (account) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [account]);

    const startChallenge = (size: number) => {
        const newAccount: TraderAccount = {
            id: crypto.randomUUID(),
            stage: 'challenge',
            initialBalance: size,
            currentBalance: size,
            equity: size,
            dailyStartingEquity: size,
            totalTrades: 0,
            tradingDays: 0,
            startDate: Date.now(),
            trades: [],
            status: 'active',
        };
        setAccount(newAccount);
    };

    const placeTrade = (symbol: string, type: 'buy' | 'sell', lots: number, price: number) => {
        if (!account || account.status !== 'active') return;

        const newTrade: Trade = {
            id: crypto.randomUUID(),
            symbol,
            type,
            lots,
            openPrice: price,
            openTime: Date.now(),
            profit: 0, // Initial profit is 0
        };

        const updatedAccount = {
            ...account,
            trades: [...account.trades, newTrade],
            totalTrades: account.totalTrades + 1,
            lastTradeDate: Date.now(),
        };

        // Check if it's a new trading day (simplified logic)
        const lastDate = account.lastTradeDate ? new Date(account.lastTradeDate).getDate() : null;
        const currentDate = new Date().getDate();
        if (lastDate !== currentDate) {
            updatedAccount.tradingDays += 1;
            updatedAccount.dailyStartingEquity = updatedAccount.equity; // Reset daily starting equity
        }

        setAccount(updatedAccount);
    };

    const closeTrade = (tradeId: string, price: number) => {
        if (!account || account.status !== 'active') return;

        const tradeIndex = account.trades.findIndex(t => t.id === tradeId);
        if (tradeIndex === -1) return;

        const trade = account.trades[tradeIndex];
        // Simple profit calc: (close - open) * lots * 100 (assuming standard lot size/contract)
        // This is a simplification.
        const direction = trade.type === 'buy' ? 1 : -1;
        const profit = (price - trade.openPrice) * direction * trade.lots * 100;

        const updatedTrade = {
            ...trade,
            closePrice: price,
            closeTime: Date.now(),
            profit: profit,
        };

        const updatedTrades = [...account.trades];
        updatedTrades[tradeIndex] = updatedTrade;

        const newBalance = account.currentBalance + profit;
        const newEquity = newBalance; // Assuming no other open trades for simplicity

        let updatedAccount: TraderAccount = {
            ...account,
            currentBalance: newBalance,
            equity: newEquity,
            trades: updatedTrades,
        };

        // Check Rules
        const ruleCheck = checkRules(updatedAccount);
        if (ruleCheck.status !== 'active') {
            updatedAccount.status = ruleCheck.status;
            updatedAccount.violationReason = ruleCheck.reason;

            if (ruleCheck.status === 'passed') {
                // Auto transition? Or wait for user? Let's auto transition for now or just mark as passed
                const nextStage = getNextStage(updatedAccount.stage);
                // In a real app, we might wait for a "Request Upgrade" button
                // For this demo, let's just update the stage if they pass
                updatedAccount.stage = nextStage;
                updatedAccount.status = 'active'; // Reset to active in new stage
                updatedAccount.initialBalance = newBalance; // Carry over balance? Or reset? Usually reset to funded amount.
                // For simplicity, let's keep the balance but reset the "initial" for % calcs if needed.
                // Actually, prop firms usually give you a fresh account.
                // Let's just mark as passed and let the UI handle the "Next Stage" button which calls startChallenge again or similar.
                // Reverting auto-transition to keep it simple:
                updatedAccount.status = 'passed';
            }
        }

        setAccount(updatedAccount);
    };

    const resetAccount = () => {
        setAccount(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const advanceToNextStage = () => {
        if (!account || account.status !== 'passed') return;

        const nextStage = getNextStage(account.stage);

        // Create new account for next stage
        const newAccount: TraderAccount = {
            ...account,
            id: crypto.randomUUID(), // New ID for new stage
            stage: nextStage,
            // Reset balance and equity to initial size
            currentBalance: account.initialBalance,
            equity: account.initialBalance,
            dailyStartingEquity: account.initialBalance,
            // Reset stats
            totalTrades: 0,
            tradingDays: 0,
            startDate: Date.now(),
            lastTradeDate: undefined,
            trades: [],
            status: 'active',
            violationReason: undefined
        };

        setAccount(newAccount);
    };

    return (
        <EvaluationContext.Provider value={{ account, startChallenge, placeTrade, closeTrade, resetAccount, advanceToNextStage, isLoading }}>
            {children}
        </EvaluationContext.Provider>
    );
}

export function useEvaluation() {
    const context = useContext(EvaluationContext);
    if (context === undefined) {
        throw new Error('useEvaluation must be used within an EvaluationProvider');
    }
    return context;
}
