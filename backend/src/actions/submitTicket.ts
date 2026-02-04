'use server';

import { PrismaClient } from '@prisma/client';
import { validateAndCalculateRisk, BetType } from '@/utils/risk-engine';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface BetInput {
  type: BetType;
  number: string;
  amount: number;
}

export interface SubmitTicketInput {
  userId: string;
  roundId: string;
  bets: BetInput[];
}

export interface SubmitTicketResult {
  success: boolean;
  ticketId?: string;
  ticketNumber?: string;
  message: string;
  rejectedBets?: Array<{
    type: string;
    number: string;
    reason: string;
  }>;
  acceptedBets?: Array<{
    type: string;
    number: string;
    amount: number;
    assignedPayout: number;
    potentialWin: number;
    tier: string;
  }>;
}

// ============================================
// MAIN SERVER ACTION
// ============================================
/**
 * Submit a lottery ticket with multiple bets.
 * Each bet is validated through the Risk Engine before acceptance.
 * 
 * @param input - Ticket submission data
 * @returns Result with ticket details or rejection reasons
 */
export async function submitTicket(input: SubmitTicketInput): Promise<SubmitTicketResult> {
  try {
    // ============================================
    // STEP 1: Validate Input
    // ============================================
    if (!input.bets || input.bets.length === 0) {
      return {
        success: false,
        message: 'กรุณาเลือกเลขที่ต้องการแทงอย่างน้อย 1 เลข'
      };
    }

    // ============================================
    // STEP 2: Fetch User and Check Referrer
    // ============================================
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: {
        id: true,
        username: true,
        balance: true,
        referredBy: true,
        status: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      };
    }

    if (user.status !== 'ACTIVE') {
      return {
        success: false,
        message: 'บัญชีของคุณถูกระงับ กรุณาติดต่อแอดมิน'
      };
    }

    const hasReferrer = !!user.referredBy;

    // ============================================
    // STEP 3: Validate Round
    // ============================================
    const round = await prisma.lotteryRound.findUnique({
      where: { id: input.roundId },
      select: {
        id: true,
        status: true,
        closeTime: true
      }
    });

    if (!round) {
      return {
        success: false,
        message: 'ไม่พบงวดหวยที่เลือก'
      };
    }

    if (round.status !== 'OPEN') {
      return {
        success: false,
        message: 'งวดหวยนี้ปิดรับแล้ว'
      };
    }

    if (new Date() > round.closeTime) {
      return {
        success: false,
        message: 'หมดเวลารับแทงแล้ว'
      };
    }

    // ============================================
    // STEP 4: Calculate Total Amount
    // ============================================
    const totalAmount = input.bets.reduce((sum, bet) => sum + bet.amount, 0);

    if (totalAmount <= 0) {
      return {
        success: false,
        message: 'ยอดเงินไม่ถูกต้อง'
      };
    }

    if (user.balance < totalAmount) {
      return {
        success: false,
        message: `ยอดเงินไม่เพียงพอ (คุณมี ${user.balance.toLocaleString()} บาท ต้องการ ${totalAmount.toLocaleString()} บาท)`
      };
    }

    // ============================================
    // STEP 5: Validate Each Bet Through Risk Engine
    // ============================================
    const validatedBets: Array<{
      bet: BetInput;
      validation: any;
    }> = [];

    const rejectedBets: Array<{
      type: string;
      number: string;
      reason: string;
    }> = [];

    // Validate all bets sequentially
    for (const bet of input.bets) {
      try {
        const validation = await validateAndCalculateRisk(
          bet.type,
          bet.number,
          bet.amount,
          hasReferrer
        );

        if (validation.isValid) {
          validatedBets.push({ bet, validation });
        } else {
          rejectedBets.push({
            type: bet.type,
            number: bet.number,
            reason: validation.message
          });
        }
      } catch (error) {
        rejectedBets.push({
          type: bet.type,
          number: bet.number,
          reason: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการตรวจสอบ'
        });
      }
    }

    // If all bets were rejected
    if (validatedBets.length === 0) {
      return {
        success: false,
        message: 'ไม่สามารถรับแทงได้ทั้งหมด',
        rejectedBets
      };
    }

    // ============================================
    // STEP 6: Create Ticket in Transaction
    // ============================================
    const result = await prisma.$transaction(async (tx) => {
      // Calculate net amount (after affiliate commission if applicable)
      const config = await tx.systemConfig.findUnique({
        where: { id: 'config' }
      });

      if (!config) {
        throw new Error('System configuration not found');
      }

      const affiliateRate = Number(config.affiliateRate);
      const netAmount = hasReferrer 
        ? totalAmount * (1 - affiliateRate) 
        : totalAmount;

      const commissionPaid = hasReferrer ? totalAmount * affiliateRate : 0;

      // Generate unique ticket number
      const ticketNumber = `TK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          userId: input.userId,
          roundId: input.roundId,
          totalAmount,
          netAmount,
          hasReferrer,
          commissionPaid,
          status: 'PENDING',
          bets: {
            create: validatedBets.map(({ bet, validation }) => ({
              type: bet.type,
              number: bet.number,
              amount: bet.amount,
              assignedPayout: validation.assignedPayout,
              potentialWin: validation.potentialWin,
              status: 'PENDING'
            }))
          }
        },
        include: {
          bets: true
        }
      });

      // Deduct balance from user
      await tx.user.update({
        where: { id: input.userId },
        data: {
          balance: {
            decrement: totalAmount
          }
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: input.userId,
          type: 'BET',
          amount: totalAmount,
          balanceBefore: user.balance,
          balanceAfter: user.balance - totalAmount,
          status: 'COMPLETED',
          reference: ticketNumber,
          note: `แทงหวย ${validatedBets.length} เลข`
        }
      });

      // If user has referrer, create commission transaction
      if (hasReferrer && user.referredBy && commissionPaid > 0) {
        const referrer = await tx.user.findUnique({
          where: { id: user.referredBy }
        });

        if (referrer) {
          await tx.user.update({
            where: { id: user.referredBy },
            data: {
              balance: {
                increment: commissionPaid
              }
            }
          });

          await tx.transaction.create({
            data: {
              userId: user.referredBy,
              type: 'COMMISSION',
              amount: commissionPaid,
              balanceBefore: referrer.balance,
              balanceAfter: referrer.balance + commissionPaid,
              status: 'COMPLETED',
              reference: ticketNumber,
              note: `ค่าคอมจาก ${user.username}`
            }
          });
        }
      }

      return ticket;
    });

    // ============================================
    // STEP 7: Revalidate and Return Success
    // ============================================
    revalidatePath('/dashboard');
    revalidatePath('/tickets');

    return {
      success: true,
      ticketId: result.id,
      ticketNumber: result.ticketNumber,
      message: `แทงสำเร็จ! ${validatedBets.length} เลข${rejectedBets.length > 0 ? ` (ปฏิเสธ ${rejectedBets.length} เลข)` : ''}`,
      acceptedBets: validatedBets.map(({ bet, validation }) => ({
        type: bet.type,
        number: bet.number,
        amount: bet.amount,
        assignedPayout: validation.assignedPayout,
        potentialWin: validation.potentialWin,
        tier: validation.tier
      })),
      rejectedBets: rejectedBets.length > 0 ? rejectedBets : undefined
    };

  } catch (error) {
    console.error('Error submitting ticket:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแทง กรุณาลองใหม่อีกครั้ง'
    };
  }
}

// ============================================
// UTILITY: Get User Tickets
// ============================================
export async function getUserTickets(userId: string, limit: number = 20) {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    include: {
      bets: true,
      round: {
        select: {
          roundNumber: true,
          lotteryType: true,
          drawDate: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });

  return tickets;
}

// ============================================
// UTILITY: Cancel Ticket (Before round closes)
// ============================================
export async function cancelTicket(ticketId: string, userId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        round: true,
        bets: true
      }
    });

    if (!ticket) {
      return {
        success: false,
        message: 'ไม่พบโพยที่ต้องการยกเลิก'
      };
    }

    if (ticket.userId !== userId) {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์ยกเลิกโพยนี้'
      };
    }

    if (ticket.status !== 'PENDING') {
      return {
        success: false,
        message: 'ไม่สามารถยกเลิกโพยนี้ได้แล้ว'
      };
    }

    if (ticket.round.status !== 'OPEN') {
      return {
        success: false,
        message: 'งวดหวยปิดรับแล้ว ไม่สามารถยกเลิกได้'
      };
    }

    // Cancel ticket and refund
    await prisma.$transaction(async (tx) => {
      // Update ticket status
      await tx.ticket.update({
        where: { id: ticketId },
        data: { status: 'CANCELLED' }
      });

      // Update bet statuses
      await tx.bet.updateMany({
        where: { ticketId },
        data: { status: 'CANCELLED' }
      });

      // Refund user balance
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (user) {
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: {
              increment: ticket.totalAmount
            }
          }
        });

        await tx.transaction.create({
          data: {
            userId,
            type: 'BET',
            amount: ticket.totalAmount,
            balanceBefore: user.balance,
            balanceAfter: user.balance + ticket.totalAmount,
            status: 'COMPLETED',
            reference: ticket.ticketNumber,
            note: 'คืนเงินจากการยกเลิกโพย'
          }
        });
      }

      // Reduce risk tracking
      for (const bet of ticket.bets) {
        await tx.lottoRisk.updateMany({
          where: {
            type: bet.type,
            number: bet.number
          },
          data: {
            totalBetAmount: {
              decrement: Number(bet.amount)
            },
            betCount: {
              decrement: 1
            }
          }
        });
      }

      // Reduce global stats
      await tx.globalStats.update({
        where: { id: 'stats' },
        data: {
          netTotalSales: {
            decrement: Number(ticket.netAmount)
          },
          totalTickets: {
            decrement: 1
          }
        }
      });
    });

    revalidatePath('/tickets');

    return {
      success: true,
      message: 'ยกเลิกโพยสำเร็จ เงินได้รับคืนแล้ว'
    };

  } catch (error) {
    console.error('Error cancelling ticket:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกโพย'
    };
  }
}
