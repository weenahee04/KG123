/**
 * Bot Simulation System Types
 * 
 * Simulates realistic user betting behavior for risk testing
 */

import { BetType } from '../config/risk-constants';

/**
 * Bot user profile
 */
export interface BotUser {
  id: string;
  name: string;
  behavior: 'conservative' | 'moderate' | 'aggressive' | 'whale';
  hasReferrer: boolean;
  avgBetAmount: number;
  minBetAmount: number;
  maxBetAmount: number;
  favoriteBetTypes: BetType[];
  favoriteNumbers: string[];
  betsPerDay: number;
}

/**
 * Bot simulation configuration
 */
export interface BotSimulationConfig {
  enabled: boolean;
  numberOfBots: number;
  dailyTargetVolume: number;  // Target daily bet volume in THB
  speedMultiplier: number;     // 1 = real-time, 60 = 1 hour in 1 minute
  behaviorDistribution: {
    conservative: number;      // % of bots (e.g., 40%)
    moderate: number;          // % of bots (e.g., 35%)
    aggressive: number;        // % of bots (e.g., 20%)
    whale: number;             // % of bots (e.g., 5%)
  };
  referrerRate: number;        // % of bots with referrer (e.g., 60%)
  betTypeDistribution: {
    TOP3: number;
    TOAD3: number;
    TOP2: number;
    BOTTOM2: number;
  };
  peakHours: number[];         // Hours with higher activity (e.g., [12, 18, 20])
}

/**
 * Behavior profiles for different bot types
 */
export const BOT_BEHAVIORS = {
  conservative: {
    avgBetAmount: 50,
    minBetAmount: 20,
    maxBetAmount: 200,
    betsPerDay: 5,
    description: 'แทงน้อย ระมัดระวัง',
  },
  moderate: {
    avgBetAmount: 150,
    minBetAmount: 50,
    maxBetAmount: 500,
    betsPerDay: 10,
    description: 'แทงปานกลาง',
  },
  aggressive: {
    avgBetAmount: 500,
    minBetAmount: 200,
    maxBetAmount: 2000,
    betsPerDay: 20,
    description: 'แทงบ่อย จำนวนมาก',
  },
  whale: {
    avgBetAmount: 5000,
    minBetAmount: 1000,
    maxBetAmount: 20000,
    betsPerDay: 30,
    description: 'ปลาวาฬ แทงหนัก',
  },
};

/**
 * Bot bet action
 */
export interface BotBetAction {
  botId: string;
  botName: string;
  betType: BetType;
  number: string;
  amount: number;
  hasReferrer: boolean;
  timestamp: Date;
}

/**
 * Simulation statistics
 */
export interface SimulationStats {
  totalBots: number;
  activeBots: number;
  totalBets: number;
  totalVolume: number;
  totalCommission: number;
  averageBetSize: number;
  betsPerMinute: number;
  currentDailyVolume: number;
  targetDailyVolume: number;
  progressPercent: number;
  riskMetrics: {
    numbersAtRisk: number;
    highestUsagePercent: number;
    highestUsageNumber: string;
    rejectedBets: number;
  };
  startTime: Date;
  elapsedTime: number;
}

/**
 * Simulation event
 */
export interface SimulationEvent {
  type: 'bet_placed' | 'bet_rejected' | 'limit_reached' | 'bot_created' | 'simulation_started' | 'simulation_stopped';
  timestamp: Date;
  data: any;
  message: string;
}

/**
 * Default simulation configuration
 */
export const DEFAULT_BOT_CONFIG: BotSimulationConfig = {
  enabled: false,
  numberOfBots: 100,
  dailyTargetVolume: 1_000_000,  // 1 million THB per day
  speedMultiplier: 60,            // 1 hour = 1 minute
  behaviorDistribution: {
    conservative: 40,
    moderate: 35,
    aggressive: 20,
    whale: 5,
  },
  referrerRate: 60,
  betTypeDistribution: {
    TOP3: 30,
    TOAD3: 20,
    TOP2: 25,
    BOTTOM2: 25,
  },
  peakHours: [12, 18, 20, 21],
};

/**
 * Popular numbers for realistic distribution
 */
export const POPULAR_NUMBERS = {
  TOP3: ['123', '456', '789', '888', '999', '777', '666', '555', '100', '200'],
  TOAD3: ['123', '456', '789', '888', '999', '777', '666', '555', '100', '200'],
  TOP2: ['12', '23', '34', '45', '56', '67', '78', '89', '90', '01'],
  BOTTOM2: ['12', '23', '34', '45', '56', '67', '78', '89', '90', '01'],
};
