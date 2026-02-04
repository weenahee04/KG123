/**
 * Bet Tracking Service
 * 
 * Manages bet tracking tables for all bet types
 * Tracks bets per number and calculates usage statistics
 */

import {
  BetRecord,
  NumberBetSummary,
  BetTrackingTable,
  BetTrackingState,
  BetStatistics,
  GridCell,
  GRID_CONFIGS,
} from '../types/bet-tracking';
import {
  BetType,
  INITIAL_CAPITAL,
  calculateMaxBetLimit,
  determineRiskStatus,
} from '../config/risk-constants';

/**
 * Initialize empty bet tracking table for a bet type
 */
export function initializeBetTrackingTable(betType: BetType): BetTrackingTable {
  return {
    betType,
    numbers: new Map<string, NumberBetSummary>(),
    totalBets: 0,
    totalAmount: 0,
    totalNetAmount: 0,
    lastUpdated: new Date(),
  };
}

/**
 * Initialize complete bet tracking state
 */
export function initializeBetTrackingState(): BetTrackingState {
  return {
    tables: {
      TOP3: initializeBetTrackingTable('TOP3'),
      TOAD3: initializeBetTrackingTable('TOAD3'),
      TOP2: initializeBetTrackingTable('TOP2'),
      BOTTOM2: initializeBetTrackingTable('BOTTOM2'),
    },
    totalCapital: INITIAL_CAPITAL,
    totalSales: 0,
    totalCommission: 0,
    lastUpdated: new Date(),
  };
}

/**
 * Add a bet to the tracking system
 */
export function addBetToTracking(
  state: BetTrackingState,
  bet: BetRecord
): BetTrackingState {
  const table = state.tables[bet.betType];
  const number = bet.number;

  // Get or create number summary
  let summary = table.numbers.get(number);
  
  if (!summary) {
    // Create new summary for this number
    const currentLimit = calculateMaxBetLimit(bet.betType, state.totalSales);
    summary = {
      number,
      betType: bet.betType,
      totalBets: 0,
      totalAmount: 0,
      totalNetAmount: 0,
      totalCommission: 0,
      averageAmount: 0,
      currentLimit,
      usagePercent: 0,
      status: 'safe',
      lastUpdated: new Date(),
    };
  }

  // Update summary
  summary.totalBets += 1;
  summary.totalAmount += bet.amount;
  summary.totalNetAmount += bet.netAmount;
  summary.totalCommission += bet.commission;
  summary.averageAmount = summary.totalAmount / summary.totalBets;
  
  // Recalculate limit and usage
  summary.currentLimit = calculateMaxBetLimit(bet.betType, state.totalSales);
  const usageRatio = summary.totalAmount / summary.currentLimit;
  summary.usagePercent = usageRatio * 100;
  
  // Determine status
  if (usageRatio > 1.0) {
    summary.status = 'critical';
  } else if (usageRatio > 0.85) {
    summary.status = 'danger';
  } else if (usageRatio > 0.70) {
    summary.status = 'warning';
  } else {
    summary.status = 'safe';
  }
  
  summary.lastUpdated = new Date();

  // Update table
  table.numbers.set(number, summary);
  table.totalBets += 1;
  table.totalAmount += bet.amount;
  table.totalNetAmount += bet.netAmount;
  table.lastUpdated = new Date();

  // Update state totals
  state.totalSales += bet.netAmount;
  state.totalCommission += bet.commission;
  state.lastUpdated = new Date();

  return state;
}

/**
 * Get bet summary for a specific number
 */
export function getNumberSummary(
  state: BetTrackingState,
  betType: BetType,
  number: string
): NumberBetSummary | null {
  return state.tables[betType].numbers.get(number) || null;
}

/**
 * Get all numbers with bets for a bet type
 */
export function getActiveNumbers(
  state: BetTrackingState,
  betType: BetType
): NumberBetSummary[] {
  return Array.from(state.tables[betType].numbers.values())
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Get top N numbers by bet amount
 */
export function getTopNumbers(
  state: BetTrackingState,
  betType: BetType,
  limit: number = 10
): NumberBetSummary[] {
  return getActiveNumbers(state, betType).slice(0, limit);
}

/**
 * Get numbers in danger/critical zones
 */
export function getRiskyNumbers(
  state: BetTrackingState,
  betType: BetType
): NumberBetSummary[] {
  return Array.from(state.tables[betType].numbers.values())
    .filter(s => s.status === 'danger' || s.status === 'critical')
    .sort((a, b) => b.usagePercent - a.usagePercent);
}

/**
 * Calculate statistics for a bet type
 */
export function calculateBetStatistics(
  state: BetTrackingState,
  betType: BetType
): BetStatistics {
  const table = state.tables[betType];
  const config = GRID_CONFIGS[betType];
  const summaries = Array.from(table.numbers.values());

  const totalNumbers = config.endNumber - config.startNumber + 1;
  const activeNumbers = summaries.length;
  const emptyNumbers = totalNumbers - activeNumbers;

  const safeNumbers = summaries.filter(s => s.status === 'safe').length;
  const warningNumbers = summaries.filter(s => s.status === 'warning').length;
  const dangerNumbers = summaries.filter(s => s.status === 'danger').length;
  const criticalNumbers = summaries.filter(s => s.status === 'critical').length;

  const averageBetPerNumber = activeNumbers > 0 
    ? table.totalAmount / activeNumbers 
    : 0;

  const sortedByAmount = [...summaries].sort((a, b) => b.totalAmount - a.totalAmount);
  const highest = sortedByAmount[0];
  const lowest = sortedByAmount[sortedByAmount.length - 1];

  return {
    betType,
    totalNumbers,
    activeNumbers,
    emptyNumbers,
    safeNumbers,
    warningNumbers,
    dangerNumbers,
    criticalNumbers,
    averageBetPerNumber,
    highestBetNumber: highest?.number || '-',
    highestBetAmount: highest?.totalAmount || 0,
    lowestBetNumber: lowest?.number || '-',
    lowestBetAmount: lowest?.totalAmount || 0,
  };
}

/**
 * Generate grid data for visualization
 */
export function generateGridData(
  state: BetTrackingState,
  betType: BetType
): GridCell[][] {
  const config = GRID_CONFIGS[betType];
  
  // Add null check
  if (!state || !state.tables || !state.tables[betType]) {
    return [];
  }
  
  const table = state.tables[betType];
  const grid: GridCell[][] = [];

  for (let row = 0; row < config.rows; row++) {
    const rowData: GridCell[] = [];
    
    for (let col = 0; col < config.cols; col++) {
      const numberValue = row * config.cols + col;
      
      if (numberValue > config.endNumber) {
        break;
      }

      const number = numberValue.toString().padStart(
        config.numberFormat === 'XXX' ? 3 : 2,
        '0'
      );

      const summary = table.numbers.get(number);

      if (summary) {
        rowData.push({
          number,
          amount: summary.totalAmount,
          usagePercent: summary.usagePercent,
          status: summary.status,
          betCount: summary.totalBets,
        });
      } else {
        rowData.push({
          number,
          amount: 0,
          usagePercent: 0,
          status: 'empty',
          betCount: 0,
        });
      }
    }
    
    if (rowData.length > 0) {
      grid.push(rowData);
    }
  }

  return grid;
}

/**
 * Export bet tracking data to CSV format
 */
export function exportToCSV(
  state: BetTrackingState,
  betType: BetType
): string {
  const summaries = getActiveNumbers(state, betType);
  
  const headers = [
    'Number',
    'Total Bets',
    'Total Amount',
    'Net Amount',
    'Commission',
    'Average',
    'Limit',
    'Usage %',
    'Status',
  ];

  const rows = summaries.map(s => [
    s.number,
    s.totalBets.toString(),
    s.totalAmount.toFixed(2),
    s.totalNetAmount.toFixed(2),
    s.totalCommission.toFixed(2),
    s.averageAmount.toFixed(2),
    s.currentLimit.toFixed(2),
    s.usagePercent.toFixed(2),
    s.status.toUpperCase(),
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}

/**
 * Get summary report for all bet types
 */
export function getSummaryReport(state: BetTrackingState): {
  betType: BetType;
  totalBets: number;
  totalAmount: number;
  activeNumbers: number;
  riskyNumbers: number;
}[] {
  return (['TOP3', 'TOAD3', 'TOP2', 'BOTTOM2'] as BetType[]).map(betType => {
    const table = state.tables[betType];
    const stats = calculateBetStatistics(state, betType);
    
    return {
      betType,
      totalBets: table.totalBets,
      totalAmount: table.totalAmount,
      activeNumbers: stats.activeNumbers,
      riskyNumbers: stats.dangerNumbers + stats.criticalNumbers,
    };
  });
}

/**
 * Reset bet tracking for a new round
 */
export function resetBetTracking(state: BetTrackingState): BetTrackingState {
  return {
    ...initializeBetTrackingState(),
    totalCapital: state.totalCapital,
  };
}

/**
 * Check if a number can accept more bets
 */
export function canAcceptBet(
  state: BetTrackingState,
  betType: BetType,
  number: string,
  amount: number
): {
  canAccept: boolean;
  reason: string;
  currentUsage: number;
  newUsage: number;
  limit: number;
} {
  const summary = getNumberSummary(state, betType, number);
  const limit = calculateMaxBetLimit(betType, state.totalSales);
  
  const currentAmount = summary?.totalAmount || 0;
  const newTotalAmount = currentAmount + amount;
  const currentUsage = (currentAmount / limit) * 100;
  const newUsage = (newTotalAmount / limit) * 100;

  if (newUsage > 100) {
    return {
      canAccept: false,
      reason: `เกินลิมิต! จะทำให้ยอดรวมเป็น ${newUsage.toFixed(1)}% ของลิมิต`,
      currentUsage,
      newUsage,
      limit,
    };
  }

  return {
    canAccept: true,
    reason: newUsage > 85 
      ? `อยู่ในโซนอันตราย (${newUsage.toFixed(1)}%)` 
      : newUsage > 70 
      ? `อยู่ในโซนเตือน (${newUsage.toFixed(1)}%)` 
      : `ปกติ (${newUsage.toFixed(1)}%)`,
    currentUsage,
    newUsage,
    limit,
  };
}
