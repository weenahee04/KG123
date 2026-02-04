import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// TYPE DEFINITIONS
// ============================================
export type BetType = 'TOP3' | 'TOAD3' | 'TOP2' | 'BOTTOM2' | 'RUN';

export interface RiskValidationResult {
  isValid: boolean;
  assignedPayout: number;
  potentialWin: number;
  usageRatio: number;
  usagePercent: number;
  maxLimit: number;
  currentTotal: number;
  newTotal: number;
  tier: 'BASE' | 'TIER1' | 'TIER2' | 'REJECTED';
  message: string;
}

export interface AllocationConfig {
  TOP3: number;
  TOAD3: number;
  TOP2: number;
  BOTTOM2: number;
  RUN: number;
}

// ============================================
// ALLOCATION PERCENTAGES
// ============================================
const ALLOCATION_PERCENTAGES: AllocationConfig = {
  TOP3: 0.20,      // 20%
  TOAD3: 0.20,     // 20%
  TOP2: 0.30,      // 30%
  BOTTOM2: 0.30,   // 30%
  RUN: 0.05,       // 5%
};

// ============================================
// MAIN RISK ENGINE FUNCTION
// ============================================
/**
 * Validates a bet and calculates the assigned payout rate based on current risk exposure.
 * This function MUST be called inside a Prisma transaction to prevent race conditions.
 * 
 * @param betType - Type of bet (TOP3, TOAD3, TOP2, BOTTOM2, RUN)
 * @param number - The number being bet on (e.g., "123", "45", "7")
 * @param amount - Bet amount in currency
 * @param hasReferrer - Whether the user has a referrer (affects net sales calculation)
 * @returns RiskValidationResult with validation status and assigned payout
 */
export async function validateAndCalculateRisk(
  betType: BetType,
  number: string,
  amount: number,
  hasReferrer: boolean = false
): Promise<RiskValidationResult> {
  
  // Use Prisma transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    
    // ============================================
    // STEP A: Calculate Net Sales (Affiliate Logic)
    // ============================================
    const config = await tx.systemConfig.findUnique({
      where: { id: 'config' }
    });

    if (!config) {
      throw new Error('System configuration not found. Please initialize SystemConfig.');
    }

    const affiliateRate = Number(config.affiliateRate);
    const netAmount = hasReferrer 
      ? amount * (1 - affiliateRate) 
      : amount;

    // ============================================
    // STEP B: Calculate Dynamic Limit
    // ============================================
    const stats = await tx.globalStats.findUnique({
      where: { id: 'stats' }
    });

    if (!stats) {
      throw new Error('Global statistics not found. Please initialize GlobalStats.');
    }

    const initialCapital = Number(config.initialCapital);
    const netTotalSales = Number(stats.netTotalSales);
    const currentPool = initialCapital + netTotalSales;

    // Get allocation percentage for this bet type
    const allocationPercentage = ALLOCATION_PERCENTAGES[betType];
    
    // Get base payout for this bet type
    const basePayout = getBasePayout(config, betType);
    
    // Calculate maximum limit per number
    const maxLimitPerNumber = (currentPool * allocationPercentage) / basePayout;

    // ============================================
    // STEP C: Step-Down Payout (Risk Control)
    // ============================================
    
    // Fetch or create LottoRisk record for this number
    let lottoRisk = await tx.lottoRisk.findUnique({
      where: {
        type_number: {
          type: betType,
          number: number
        }
      }
    });

    // If this number hasn't been bet on yet, create a new record
    if (!lottoRisk) {
      lottoRisk = await tx.lottoRisk.create({
        data: {
          type: betType,
          number: number,
          totalBetAmount: 0,
          betCount: 0,
          isBlocked: false
        }
      });
    }

    // Check if number is manually blocked
    if (lottoRisk.isBlocked) {
      return {
        isValid: false,
        assignedPayout: 0,
        potentialWin: 0,
        usageRatio: 0,
        usagePercent: 0,
        maxLimit: maxLimitPerNumber,
        currentTotal: Number(lottoRisk.totalBetAmount),
        newTotal: Number(lottoRisk.totalBetAmount) + amount,
        tier: 'REJECTED',
        message: `เลข ${number} ถูกปิดรับแล้ว (Manually Blocked)`
      };
    }

    const currentTotalBet = Number(lottoRisk.totalBetAmount);
    const newTotalBet = currentTotalBet + amount;
    const usageRatio = newTotalBet / maxLimitPerNumber;
    const usagePercent = usageRatio * 100;

    // Get thresholds
    const warningThreshold = Number(config.warningThreshold);
    const dangerThreshold = Number(config.dangerThreshold);
    const rejectThreshold = Number(config.rejectThreshold);

    // ============================================
    // DECISION TREE: Determine Payout Tier
    // ============================================
    let assignedPayout: number;
    let tier: 'BASE' | 'TIER1' | 'TIER2' | 'REJECTED';
    let message: string;
    let isValid: boolean;

    if (usageRatio > rejectThreshold) {
      // REJECT: Over limit
      assignedPayout = 0;
      tier = 'REJECTED';
      isValid = false;
      message = `เกินลิมิต! ยอดแทงรวม ${newTotalBet.toLocaleString()} บาท เกินลิมิตสูงสุด ${maxLimitPerNumber.toLocaleString()} บาท (${usagePercent.toFixed(1)}%)`;
      
    } else if (usageRatio > dangerThreshold) {
      // TIER 2: Danger zone (85-100%)
      assignedPayout = getTier2Payout(config, betType);
      tier = 'TIER2';
      isValid = true;
      message = `รับแทงได้ แต่ลดอัตราจ่ายเหลือ ${assignedPayout}x (โซนอันตราย ${usagePercent.toFixed(1)}%)`;
      
    } else if (usageRatio > warningThreshold) {
      // TIER 1: Warning zone (70-85%)
      assignedPayout = getTier1Payout(config, betType);
      tier = 'TIER1';
      isValid = true;
      message = `รับแทงได้ แต่ลดอัตราจ่ายเหลือ ${assignedPayout}x (โซนเตือน ${usagePercent.toFixed(1)}%)`;
      
    } else {
      // BASE: Safe zone (<70%)
      assignedPayout = basePayout;
      tier = 'BASE';
      isValid = true;
      message = `รับแทงได้เต็มอัตรา ${assignedPayout}x (โซนปลอดภัย ${usagePercent.toFixed(1)}%)`;
    }

    const potentialWin = amount * assignedPayout;

    // ============================================
    // UPDATE RISK TRACKING (Only if valid)
    // ============================================
    if (isValid) {
      await tx.lottoRisk.update({
        where: {
          type_number: {
            type: betType,
            number: number
          }
        },
        data: {
          totalBetAmount: {
            increment: amount
          },
          betCount: {
            increment: 1
          }
        }
      });

      // Update global stats with net amount
      await tx.globalStats.update({
        where: { id: 'stats' },
        data: {
          netTotalSales: {
            increment: netAmount
          },
          totalTickets: {
            increment: 1
          }
        }
      });
    }

    return {
      isValid,
      assignedPayout,
      potentialWin,
      usageRatio,
      usagePercent,
      maxLimit: maxLimitPerNumber,
      currentTotal: currentTotalBet,
      newTotal: newTotalBet,
      tier,
      message
    };
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBasePayout(config: any, betType: BetType): number {
  switch (betType) {
    case 'TOP3':
      return Number(config.payoutTop3);
    case 'TOAD3':
      return Number(config.payoutToad3);
    case 'TOP2':
      return Number(config.payoutTop2);
    case 'BOTTOM2':
      return Number(config.payoutBottom2);
    case 'RUN':
      return Number(config.payoutRun);
    default:
      throw new Error(`Invalid bet type: ${betType}`);
  }
}

function getTier1Payout(config: any, betType: BetType): number {
  switch (betType) {
    case 'TOP3':
      return Number(config.payoutTop3Tier1);
    case 'TOAD3':
      return Number(config.payoutToad3Tier1);
    case 'TOP2':
      return Number(config.payoutTop2Tier1);
    case 'BOTTOM2':
      return Number(config.payoutBottom2Tier1);
    case 'RUN':
      return Number(config.payoutRunTier1);
    default:
      throw new Error(`Invalid bet type: ${betType}`);
  }
}

function getTier2Payout(config: any, betType: BetType): number {
  switch (betType) {
    case 'TOP3':
      return Number(config.payoutTop3Tier2);
    case 'TOAD3':
      return Number(config.payoutToad3Tier2);
    case 'TOP2':
      return Number(config.payoutTop2Tier2);
    case 'BOTTOM2':
      return Number(config.payoutBottom2Tier2);
    case 'RUN':
      return Number(config.payoutRunTier2);
    default:
      throw new Error(`Invalid bet type: ${betType}`);
  }
}

// ============================================
// UTILITY: Reset Risk Data (for new round)
// ============================================
export async function resetRiskDataForNewRound(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Delete all risk tracking records
    await tx.lottoRisk.deleteMany({});
    
    console.log('✅ Risk data reset for new lottery round');
  });
}

// ============================================
// UTILITY: Get Current Risk Summary
// ============================================
export async function getRiskSummary(betType?: BetType) {
  const where = betType ? { type: betType } : {};
  
  const risks = await prisma.lottoRisk.findMany({
    where,
    orderBy: {
      totalBetAmount: 'desc'
    },
    take: 50
  });

  const config = await prisma.systemConfig.findUnique({
    where: { id: 'config' }
  });

  const stats = await prisma.globalStats.findUnique({
    where: { id: 'stats' }
  });

  if (!config || !stats) {
    throw new Error('System not initialized');
  }

  const currentPool = Number(config.initialCapital) + Number(stats.netTotalSales);

  return {
    currentPool,
    netTotalSales: Number(stats.netTotalSales),
    totalTickets: stats.totalTickets,
    risks: risks.map(risk => {
      const allocationPercentage = ALLOCATION_PERCENTAGES[risk.type as BetType];
      const basePayout = getBasePayout(config, risk.type as BetType);
      const maxLimit = (currentPool * allocationPercentage) / basePayout;
      const usagePercent = (Number(risk.totalBetAmount) / maxLimit) * 100;

      return {
        type: risk.type,
        number: risk.number,
        totalBetAmount: Number(risk.totalBetAmount),
        betCount: risk.betCount,
        maxLimit,
        usagePercent,
        isBlocked: risk.isBlocked
      };
    })
  };
}

export default {
  validateAndCalculateRisk,
  resetRiskDataForNewRound,
  getRiskSummary
};
