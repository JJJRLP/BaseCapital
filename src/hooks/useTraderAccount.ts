"use client";

import { useReadContract, useReadContracts } from 'wagmi';
import { traderAccountABI, riskManagerABI } from '@/lib/abis';
import { CONTRACTS } from '@/lib/contracts';

interface TraderAccountData {
    equity: bigint;
    pnl: bigint;
    initialCapital: bigint;
    withdrawableProfit: bigint;
    isActive: boolean;
    trader: string;
}

interface TraderState {
    accountContract: string;
    initialBalance: bigint;
    dailyStartingEquity: bigint;
    lastDayReset: bigint;
    stage: number;
    tradingDays: number;
    isActive: boolean;
}

/**
 * Hook to read trader account data from on-chain
 */
export function useTraderAccount(accountAddress: string | undefined) {
    const { data: accountData, isLoading: accountLoading, refetch: refetchAccount } = useReadContracts({
        contracts: accountAddress ? [
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'getEquity',
            },
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'getPnL',
            },
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'initialCapital',
            },
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'getWithdrawableProfit',
            },
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'isAccountActive',
            },
            {
                address: accountAddress as `0x${string}`,
                abi: traderAccountABI,
                functionName: 'trader',
            },
        ] : [],
        query: {
            enabled: !!accountAddress,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    });

    // Parse account data
    const parsedAccountData: TraderAccountData | undefined = accountData ? {
        equity: (accountData[0]?.result as bigint) ?? BigInt(0),
        pnl: (accountData[1]?.result as bigint) ?? BigInt(0),
        initialCapital: (accountData[2]?.result as bigint) ?? BigInt(0),
        withdrawableProfit: (accountData[3]?.result as bigint) ?? BigInt(0),
        isActive: (accountData[4]?.result as boolean) ?? false,
        trader: (accountData[5]?.result as string) ?? '',
    } : undefined;

    return {
        data: parsedAccountData,
        isLoading: accountLoading,
        refetch: refetchAccount,
    };
}

/**
 * Hook to read trader state from RiskManager
 */
export function useTraderState(accountAddress: string | undefined) {
    const riskManagerAddress = CONTRACTS.RISK_MANAGER;

    const { data, isLoading, refetch } = useReadContract({
        address: riskManagerAddress as `0x${string}`,
        abi: riskManagerABI,
        functionName: 'getTraderState',
        args: accountAddress ? [accountAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!accountAddress && !!riskManagerAddress,
            refetchInterval: 30000, // Refetch every 30 seconds
        },
    });

    const parsedState: TraderState | undefined = data ? {
        accountContract: (data as TraderState).accountContract ?? '',
        initialBalance: (data as TraderState).initialBalance ?? BigInt(0),
        dailyStartingEquity: (data as TraderState).dailyStartingEquity ?? BigInt(0),
        lastDayReset: (data as TraderState).lastDayReset ?? BigInt(0),
        stage: (data as TraderState).stage ?? 0,
        tradingDays: (data as TraderState).tradingDays ?? 0,
        isActive: (data as TraderState).isActive ?? false,
    } : undefined;

    return {
        data: parsedState,
        isLoading,
        refetch,
    };
}

/**
 * Hook to check if would fail or pass
 */
export function useTraderStatus(accountAddress: string | undefined) {
    const riskManagerAddress = CONTRACTS.RISK_MANAGER;

    const { data: wouldFailData } = useReadContract({
        address: riskManagerAddress as `0x${string}`,
        abi: riskManagerABI,
        functionName: 'wouldFail',
        args: accountAddress ? [accountAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!accountAddress && !!riskManagerAddress,
            refetchInterval: 10000,
        },
    });

    const { data: wouldPassData } = useReadContract({
        address: riskManagerAddress as `0x${string}`,
        abi: riskManagerABI,
        functionName: 'wouldPass',
        args: accountAddress ? [accountAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!accountAddress && !!riskManagerAddress,
            refetchInterval: 10000,
        },
    });

    return {
        wouldFail: wouldFailData?.[0] ?? false,
        failReason: wouldFailData?.[1] ?? '',
        wouldPass: wouldPassData ?? false,
    };
}

/**
 * Helper to format USDC amount (6 decimals)
 */
export function formatUSDC(amount: bigint): number {
    return Number(amount) / 1_000_000;
}

/**
 * Helper to parse USDC amount to bigint
 */
export function parseUSDC(amount: number): bigint {
    return BigInt(Math.floor(amount * 1_000_000));
}
