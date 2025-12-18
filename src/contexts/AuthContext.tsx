"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    wallets: Array<{
        id: string;
        address: string;
        isPrimary: boolean;
    }>;
    subscription: {
        id: string;
        planId: string;
        planName: string;
        status: string;
        startedAt: string;
        expiresAt: string | null;
        txHash: string | null;
    } | null;
    traderProfile: {
        id: string;
        stage: string;
        initialBalance: string;
        currentBalance: string;
        tradingDays: number;
        totalTrades: number;
        status: string;
    } | null;
}

interface AuthContextType {
    user: SupabaseUser | null;
    profile: UserProfile | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    linkWallet: (address: string, isPrimary?: boolean) => Promise<{ error?: string }>;
    unlinkWallet: (address: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch('/api/user/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data.user);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile();
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile();
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile]);

    const signUp = async (email: string, password: string, displayName?: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, displayName }),
            });

            const data = await response.json();
            if (!response.ok) {
                return { error: data.error };
            }

            return {};
        } catch (error) {
            console.error('Sign up error:', error);
            return { error: 'An unexpected error occurred' };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error: error.message };
            }

            return {};
        } catch (error) {
            console.error('Sign in error:', error);
            return { error: 'An unexpected error occurred' };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const refreshProfile = async () => {
        await fetchProfile();
    };

    const linkWallet = async (address: string, isPrimary = false) => {
        try {
            const response = await fetch('/api/user/wallets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, isPrimary }),
            });

            const data = await response.json();
            if (!response.ok) {
                return { error: data.error };
            }

            await fetchProfile();
            return {};
        } catch (error) {
            console.error('Link wallet error:', error);
            return { error: 'An unexpected error occurred' };
        }
    };

    const unlinkWallet = async (address: string) => {
        try {
            const response = await fetch(`/api/user/wallets?address=${encodeURIComponent(address)}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) {
                return { error: data.error };
            }

            await fetchProfile();
            return {};
        } catch (error) {
            console.error('Unlink wallet error:', error);
            return { error: 'An unexpected error occurred' };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                session,
                isLoading,
                isAuthenticated: !!user,
                signUp,
                signIn,
                signOut,
                refreshProfile,
                linkWallet,
                unlinkWallet,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
