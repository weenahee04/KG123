/**
 * Bet Tracking System Types
 * 
 * Data structures for tracking bets per number across different bet types
 * Based on handwritten notes showing grid-based bet tracking
 */

import { BetType } from '../config/risk-constants';

/**
 * Individual bet record
 */
export interface BetRecord {
  id: string;
  userId: string;
  username: string;
  betType: BetType;
  number: string;
  amount: number;
  netAmount: number;  // After commission
  commission: number;
  hasReferrer: boolean;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
  payoutRate: number;
}

/**
 * Aggregated bet data for a specific number
 */
export interface NumberBetSummary {
  number: string;
  betType: BetType;
  totalBets: number;        // Total number of bets
  totalAmount: number;      // Total bet amount
  totalNetAmount: number;   // Total after commission
  totalCommission: number;  // Total commission collected
  averageAmount: number;    // Average bet amount
  currentLimit: number;     // Current limit for this number
  usagePercent: number;     // Percentage of limit used
  status: 'safe' | 'warning' | 'danger' | 'critical';
  lastUpdated: Date;
}

/**
 * Bet tracking table for a specific bet type
 * Stores all numbers and their bet summaries
 */
export interface BetTrackingTable {
  betType: BetType;
  numbers: Map<string, NumberBetSummary>;  // Key: number (e.g., "123", "45")
  totalBets: number;
  totalAmount: number;
  totalNetAmount: number;
  lastUpdated: Date;
}

/**
 * Complete bet tracking state for all bet types
 */
export interface BetTrackingState {
  tables: {
    TOP3: BetTrackingTable;
    TOAD3: BetTrackingTable;
    TOP2: BetTrackingTable;
    BOTTOM2: BetTrackingTable;
  };
  totalCapital: number;
  totalSales: number;
  totalCommission: number;
  lastUpdated: Date;
}

/**
 * Grid cell data for visualization
 * Represents a single cell in the bet tracking grid
 */
export interface GridCell {
  number: string;
  amount: number;
  usagePercent: number;
  status: 'empty' | 'safe' | 'warning' | 'danger' | 'critical';
  betCount: number;
}

/**
 * Grid configuration for different bet types
 */
export interface GridConfig {
  betType: BetType;
  rows: number;
  cols: number;
  numberFormat: 'XXX' | 'XX' | 'X';  // 3-digit, 2-digit, or 1-digit
  startNumber: number;
  endNumber: number;
}

/**
 * Predefined grid configurations
 */
export const GRID_CONFIGS: Record<BetType, GridConfig> = {
  TOP3: {
    betType: 'TOP3',
    rows: 100,
    cols: 10,
    numberFormat: 'XXX',
    startNumber: 0,
    endNumber: 999,
  },
  TOAD3: {
    betType: 'TOAD3',
    rows: 100,
    cols: 10,
    numberFormat: 'XXX',
    startNumber: 0,
    endNumber: 999,
  },
  TOP2: {
    betType: 'TOP2',
    rows: 10,
    cols: 10,
    numberFormat: 'XX',
    startNumber: 0,
    endNumber: 99,
  },
  BOTTOM2: {
    betType: 'BOTTOM2',
    rows: 10,
    cols: 10,
    numberFormat: 'XX',
    startNumber: 0,
    endNumber: 99,
  },
};

/**
 * Bet tracking statistics
 */
export interface BetStatistics {
  betType: BetType;
  totalNumbers: number;           // Total unique numbers bet on
  activeNumbers: number;          // Numbers with bets
  emptyNumbers: number;           // Numbers without bets
  safeNumbers: number;            // Numbers in safe zone
  warningNumbers: number;         // Numbers in warning zone
  dangerNumbers: number;          // Numbers in danger zone
  criticalNumbers: number;        // Numbers at/over limit
  averageBetPerNumber: number;    // Average bet amount per number
  highestBetNumber: string;       // Number with highest bet
  highestBetAmount: number;       // Highest bet amount
  lowestBetNumber: string;        // Number with lowest bet (excluding 0)
  lowestBetAmount: number;        // Lowest bet amount
}

/**
 * Real-time update event
 */
export interface BetUpdateEvent {
  type: 'bet_placed' | 'bet_cancelled' | 'limit_updated';
  betType: BetType;
  number: string;
  amount: number;
  timestamp: Date;
  summary: NumberBetSummary;
}
