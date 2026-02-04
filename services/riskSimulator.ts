export type BetType = 'TOP3' | 'TOP2' | 'TODE' | 'RUN_TOP' | 'RUN_BOTTOM';

export interface SimulationInput {
  betType: BetType;
  number: string;
  amount: number;
  hasReferrer: boolean;
}

export interface MockSystemState {
  mockCapital: number;
  mockTotalSales: number;
  mockCurrentBetOnNumber: number;
}

export interface SimulationResult {
  status: 'ACCEPTED' | 'WARNING' | 'REJECTED';
  reason: string;
  netAmount: number;
  commission: number;
  totalPot: number;
  allocation: number;
  basePayout: number;
  currentLimit: number;
  newTotalBet: number;
  usageRatio: number;
  usagePercent: number;
  finalPayoutRate: number;
  remainingLimit: number;
}

const PAYOUT_CONFIG = {
  TOP3: {
    allocation: 0.30,  // Updated: 30% (from handwritten notes)
    basePayout: 800,
    tier1Payout: 650,
    tier2Payout: 500,
  },
  TOP2: {
    allocation: 0.20,  // Updated: 20% (adjusted to maintain 100% total)
    basePayout: 90,
    tier1Payout: 75,
    tier2Payout: 60,
  },
  TODE: {
    allocation: 0.20,  // 3 ตัวโต๊ด: 20%
    basePayout: 150,
    tier1Payout: 120,
    tier2Payout: 90,
  },
  RUN_TOP: {
    allocation: 0.15,  // Adjusted to maintain 100% total
    basePayout: 3.2,
    tier1Payout: 2.8,
    tier2Payout: 2.5,
  },
  RUN_BOTTOM: {
    allocation: 0.15,  // Adjusted to maintain 100% total
    basePayout: 4.5,
    tier1Payout: 4.0,
    tier2Payout: 3.5,
  },
};

export function simulateRiskCalculation(
  input: SimulationInput,
  mockState: MockSystemState
): SimulationResult {
  const { betType, amount, hasReferrer } = input;
  const { mockCapital, mockTotalSales, mockCurrentBetOnNumber } = mockState;

  const commission = hasReferrer ? amount * 0.08 : 0;
  const netAmount = amount - commission;

  const totalPot = mockCapital + mockTotalSales;

  const config = PAYOUT_CONFIG[betType];
  const allocation = config.allocation;
  const basePayout = config.basePayout;

  const currentLimit = Math.floor((totalPot * allocation) / basePayout);

  const newTotalBet = mockCurrentBetOnNumber + amount;

  const usageRatio = currentLimit > 0 ? newTotalBet / currentLimit : 0;
  const usagePercent = usageRatio * 100;

  let status: 'ACCEPTED' | 'WARNING' | 'REJECTED';
  let reason: string;
  let finalPayoutRate: number;

  if (usageRatio > 1.0) {
    status = 'REJECTED';
    reason = `เกินลิมิต! การแทงนี้จะทำให้ยอดรวมเกิน 100% ของลิมิต (${usagePercent.toFixed(1)}%)`;
    finalPayoutRate = 0;
  } else if (usageRatio > 0.85) {
    status = 'WARNING';
    reason = `เกิน 85% ของลิมิต (${usagePercent.toFixed(1)}%) - ลดอัตราจ่ายเป็น Tier 2`;
    finalPayoutRate = config.tier2Payout;
  } else if (usageRatio > 0.70) {
    status = 'WARNING';
    reason = `เกิน 70% ของลิมิต (${usagePercent.toFixed(1)}%) - ลดอัตราจ่ายเป็น Tier 1`;
    finalPayoutRate = config.tier1Payout;
  } else {
    status = 'ACCEPTED';
    reason = `ปกติ - ใช้ไป ${usagePercent.toFixed(1)}% ของลิมิต`;
    finalPayoutRate = basePayout;
  }

  const remainingLimit = currentLimit - newTotalBet;

  return {
    status,
    reason,
    netAmount,
    commission,
    totalPot,
    allocation,
    basePayout,
    currentLimit,
    newTotalBet,
    usageRatio,
    usagePercent,
    finalPayoutRate,
    remainingLimit,
  };
}
