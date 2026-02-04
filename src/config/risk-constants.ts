/**
 * Dynamic Risk & Pricing Model Configuration
 * 
 * This file contains all constants and configuration for the lottery system's
 * dynamic risk management and pricing model.
 * 
 * @module risk-constants
 */

// ============================================================================
// SYSTEM CONSTANTS
// ============================================================================

/**
 * Initial capital allocated to the lottery system (THB)
 */
export const INITIAL_CAPITAL = 500_000;

/**
 * Affiliate commission rate (8%)
 * Applied when a bet has a referrer
 */
export const AFFILIATE_COMMISSION_RATE = 0.08;

// ============================================================================
// BET TYPE DEFINITIONS
// ============================================================================

/**
 * Available bet types in the system
 */
export type BetType = 'TOP3' | 'TOAD3' | 'TOP2' | 'BOTTOM2';

/**
 * Bet type display names (Thai)
 */
export const BET_TYPE_NAMES: Record<BetType, string> = {
  TOP3: '3 ตัวบน',
  TOAD3: '3 ตัวโต๊ด',
  TOP2: '2 ตัวบน',
  BOTTOM2: '2 ตัวล่าง',
};

// ============================================================================
// PAYOUT CONFIGURATION
// ============================================================================

/**
 * Payout configuration for each bet type
 * 
 * @property allocation - Percentage of capital allocated to this bet type (0-1)
 * @property basePayout - Base payout multiplier when in safe zone
 * @property tier1Payout - Reduced payout when usage is 71-85%
 * @property tier2Payout - Further reduced payout when usage is 86-100%
 */
export interface PayoutConfig {
  allocation: number;
  basePayout: number;
  tier1Payout: number;
  tier2Payout: number;
}

/**
 * Complete payout configuration for all bet types
 */
export const PAYOUT_CONFIG: Record<BetType, PayoutConfig> = {
  TOP3: {
    allocation: 0.30,      // 30% of capital (updated from handwritten notes)
    basePayout: 800,       // Base payout rate
    tier1Payout: 650,      // Reduced rate (71-85% usage)
    tier2Payout: 500,      // Further reduced (86-100% usage)
  },
  TOAD3: {
    allocation: 0.20,      // 20% of capital
    basePayout: 150,       // Base payout rate
    tier1Payout: 120,      // Reduced rate (71-85% usage)
    tier2Payout: 90,       // Further reduced (86-100% usage)
  },
  TOP2: {
    allocation: 0.20,      // 20% of capital (adjusted to maintain 100% total)
    basePayout: 90,        // Base payout rate
    tier1Payout: 75,       // Reduced rate (71-85% usage)
    tier2Payout: 60,       // Further reduced (86-100% usage)
  },
  BOTTOM2: {
    allocation: 0.30,      // 30% of capital
    basePayout: 90,        // Base payout rate
    tier1Payout: 75,       // Reduced rate (71-85% usage)
    tier2Payout: 60,       // Further reduced (86-100% usage)
  },
};

// ============================================================================
// RISK ZONE THRESHOLDS
// ============================================================================

/**
 * Risk zone thresholds for step-down logic
 * These define when payout rates should be reduced
 */
export const RISK_THRESHOLDS = {
  /**
   * Safe zone: 0-70% of limit
   * Full base payout applies
   */
  SAFE_ZONE_MAX: 0.70,

  /**
   * Warning zone (Tier 1): 71-85% of limit
   * Payout reduced to tier1Payout
   */
  WARNING_ZONE_MAX: 0.85,

  /**
   * Danger zone (Tier 2): 86-100% of limit
   * Payout reduced to tier2Payout
   */
  DANGER_ZONE_MAX: 1.00,

  /**
   * Critical zone: >100% of limit
   * Bet is rejected
   */
  CRITICAL_ZONE_MIN: 1.00,
} as const;

/**
 * Risk zone status types
 */
export type RiskStatus = 'ACCEPTED' | 'WARNING' | 'REJECTED';

/**
 * Risk zone definitions with metadata
 */
export interface RiskZone {
  name: string;
  minUsage: number;
  maxUsage: number;
  status: RiskStatus;
  payoutTier: 'base' | 'tier1' | 'tier2' | 'rejected';
  color: string;
  icon: string;
}

/**
 * Complete risk zone configuration
 */
export const RISK_ZONES: RiskZone[] = [
  {
    name: 'Safe Zone',
    minUsage: 0,
    maxUsage: 0.70,
    status: 'ACCEPTED',
    payoutTier: 'base',
    color: 'green',
    icon: '✅',
  },
  {
    name: 'Warning Zone (Tier 1)',
    minUsage: 0.71,
    maxUsage: 0.85,
    status: 'WARNING',
    payoutTier: 'tier1',
    color: 'yellow',
    icon: '⚠️',
  },
  {
    name: 'Danger Zone (Tier 2)',
    minUsage: 0.86,
    maxUsage: 1.00,
    status: 'WARNING',
    payoutTier: 'tier2',
    color: 'orange',
    icon: '⚠️',
  },
  {
    name: 'Critical Zone',
    minUsage: 1.01,
    maxUsage: Infinity,
    status: 'REJECTED',
    payoutTier: 'rejected',
    color: 'red',
    icon: '❌',
  },
];

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

/**
 * Calculate the risk budget for a specific bet type
 * 
 * @param betType - The type of bet
 * @param totalCapital - Total capital available (default: INITIAL_CAPITAL)
 * @returns Risk budget in THB
 * 
 * @example
 * calculateRiskBudget('TOP3') // Returns 100,000 (20% of 500,000)
 */
export function calculateRiskBudget(
  betType: BetType,
  totalCapital: number = INITIAL_CAPITAL
): number {
  const config = PAYOUT_CONFIG[betType];
  return totalCapital * config.allocation;
}

/**
 * Calculate the maximum bet limit per number
 * 
 * Formula: (Initial Capital + Total Net Sales) × Allocation% ÷ Base Payout
 * 
 * @param betType - The type of bet
 * @param totalNetSales - Total net sales (after commission deduction)
 * @returns Maximum bet limit in THB
 * 
 * @example
 * calculateMaxBetLimit('TOP3', 0) // Returns 125 (500,000 × 20% ÷ 800)
 * calculateMaxBetLimit('TOP3', 500_000) // Returns 250 (1,000,000 × 20% ÷ 800)
 */
export function calculateMaxBetLimit(
  betType: BetType,
  totalNetSales: number
): number {
  const config = PAYOUT_CONFIG[betType];
  const totalPool = INITIAL_CAPITAL + totalNetSales;
  const riskBudget = totalPool * config.allocation;
  return Math.floor(riskBudget / config.basePayout);
}

/**
 * Calculate net amount after affiliate commission
 * 
 * @param betAmount - Original bet amount
 * @param hasReferrer - Whether the bet has a referrer
 * @returns Object with commission and net amount
 * 
 * @example
 * calculateNetAmount(1000, false) // { commission: 0, netAmount: 1000 }
 * calculateNetAmount(1000, true)  // { commission: 80, netAmount: 920 }
 */
export function calculateNetAmount(
  betAmount: number,
  hasReferrer: boolean
): { commission: number; netAmount: number } {
  const commission = hasReferrer ? betAmount * AFFILIATE_COMMISSION_RATE : 0;
  const netAmount = betAmount - commission;
  return { commission, netAmount };
}

/**
 * Calculate usage ratio for a specific number
 * 
 * @param currentBets - Current total bets on this number
 * @param newBet - New bet amount to add
 * @param maxLimit - Maximum bet limit for this number
 * @returns Usage ratio (0-1+)
 * 
 * @example
 * calculateUsageRatio(50, 30, 125) // Returns 0.64 (64% usage)
 */
export function calculateUsageRatio(
  currentBets: number,
  newBet: number,
  maxLimit: number
): number {
  if (maxLimit === 0) return Infinity;
  return (currentBets + newBet) / maxLimit;
}

/**
 * Determine the appropriate payout rate based on usage ratio
 * 
 * @param usageRatio - Current usage ratio
 * @param betType - The type of bet
 * @returns Payout rate to apply
 * 
 * @example
 * determinePayoutRate(0.65, 'TOP3') // Returns 800 (base)
 * determinePayoutRate(0.80, 'TOP3') // Returns 650 (tier1)
 * determinePayoutRate(0.95, 'TOP3') // Returns 500 (tier2)
 * determinePayoutRate(1.10, 'TOP3') // Returns 0 (rejected)
 */
export function determinePayoutRate(
  usageRatio: number,
  betType: BetType
): number {
  const config = PAYOUT_CONFIG[betType];

  if (usageRatio > RISK_THRESHOLDS.CRITICAL_ZONE_MIN) {
    return 0; // Rejected
  } else if (usageRatio > RISK_THRESHOLDS.WARNING_ZONE_MAX) {
    return config.tier2Payout; // Danger zone
  } else if (usageRatio > RISK_THRESHOLDS.SAFE_ZONE_MAX) {
    return config.tier1Payout; // Warning zone
  } else {
    return config.basePayout; // Safe zone
  }
}

/**
 * Determine risk status based on usage ratio
 * 
 * @param usageRatio - Current usage ratio
 * @returns Risk status
 */
export function determineRiskStatus(usageRatio: number): RiskStatus {
  if (usageRatio > RISK_THRESHOLDS.CRITICAL_ZONE_MIN) {
    return 'REJECTED';
  } else if (usageRatio > RISK_THRESHOLDS.SAFE_ZONE_MAX) {
    return 'WARNING';
  } else {
    return 'ACCEPTED';
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate if total allocation equals 100%
 * 
 * @returns true if valid, false otherwise
 */
export function validateAllocation(): boolean {
  const total = Object.values(PAYOUT_CONFIG).reduce(
    (sum, config) => sum + config.allocation,
    0
  );
  return Math.abs(total - 1.0) < 0.001; // Allow for floating point precision
}

/**
 * Validate bet type
 * 
 * @param betType - Bet type to validate
 * @returns true if valid
 */
export function isValidBetType(betType: string): betType is BetType {
  return betType in PAYOUT_CONFIG;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  INITIAL_CAPITAL,
  AFFILIATE_COMMISSION_RATE,
  BET_TYPE_NAMES,
  PAYOUT_CONFIG,
  RISK_THRESHOLDS,
  RISK_ZONES,
  calculateRiskBudget,
  calculateMaxBetLimit,
  calculateNetAmount,
  calculateUsageRatio,
  determinePayoutRate,
  determineRiskStatus,
  validateAllocation,
  isValidBetType,
};
