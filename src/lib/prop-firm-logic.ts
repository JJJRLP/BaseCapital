
export type EvaluationStage = 'challenge' | 'verification' | 'funded' | 'failed';

export interface Trade {
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    openPrice: number;
    closePrice?: number;
    lots: number;
    openTime: number;
    closeTime?: number;
    profit: number;
}

export interface TraderAccount {
    id: string;
    stage: EvaluationStage;
    initialBalance: number;
    currentBalance: number;
    equity: number;
    dailyStartingEquity: number; // For daily drawdown calculation
    totalTrades: number;
    tradingDays: number;
    startDate: number;
    lastTradeDate?: number;
    trades: Trade[];
    status: 'active' | 'passed' | 'failed';
    violationReason?: string;
}

export interface RuleStatus {
    rule: string;
    passed: boolean;
    value: number;
    limit: number;
    unit: string;
}

export const CONSTANTS = {
    CHALLENGE: {
        PROFIT_TARGET: 0.08, // 8%
        MAX_DAILY_LOSS: 0.05, // 5%
        MAX_TOTAL_LOSS: 0.10, // 10%
        MIN_TRADING_DAYS: 3,
    },
    VERIFICATION: {
        PROFIT_TARGET: 0.05, // 5%
        MAX_DAILY_LOSS: 0.05,
        MAX_TOTAL_LOSS: 0.10,
        MIN_TRADING_DAYS: 3,
    },
    FUNDED: {
        PROFIT_TARGET: 0, // No target
        MAX_DAILY_LOSS: 0.05,
        MAX_TOTAL_LOSS: 0.10,
        MIN_TRADING_DAYS: 0,
    },
};

export function calculateCurrentDrawdown(account: TraderAccount): number {
    const maxLoss = account.initialBalance * CONSTANTS.CHALLENGE.MAX_TOTAL_LOSS; // Simplified, should depend on stage
    const currentLoss = account.initialBalance - account.equity;
    return currentLoss;
}

export function calculateDailyDrawdown(account: TraderAccount): number {
    // Daily drawdown is calculated based on the starting equity of the day
    return account.dailyStartingEquity - account.equity;
}

export function checkRules(account: TraderAccount): { status: 'active' | 'passed' | 'failed'; reason?: string } {
    const stageConstants = CONSTANTS[account.stage.toUpperCase() as keyof typeof CONSTANTS];

    if (!stageConstants) return { status: 'active' };

    // 1. Max Total Loss
    const maxTotalLoss = account.initialBalance * stageConstants.MAX_TOTAL_LOSS;
    if (account.equity <= account.initialBalance - maxTotalLoss) {
        return { status: 'failed', reason: 'Max Total Loss Exceeded' };
    }

    // 2. Max Daily Loss
    const maxDailyLoss = account.dailyStartingEquity * stageConstants.MAX_DAILY_LOSS;
    if (account.equity <= account.dailyStartingEquity - maxDailyLoss) {
        return { status: 'failed', reason: 'Max Daily Loss Exceeded' };
    }

    // 3. Profit Target (Only for Challenge and Verification)
    if (account.stage !== 'funded') {
        const profitTarget = account.initialBalance * stageConstants.PROFIT_TARGET;
        if (account.currentBalance >= account.initialBalance + profitTarget) {
            // Check minimum trading days
            if (account.tradingDays >= stageConstants.MIN_TRADING_DAYS) {
                return { status: 'passed' };
            }
        }
    }

    return { status: 'active' };
}

export function getNextStage(currentStage: EvaluationStage): EvaluationStage {
    if (currentStage === 'challenge') return 'verification';
    if (currentStage === 'verification') return 'funded';
    return 'funded';
}
