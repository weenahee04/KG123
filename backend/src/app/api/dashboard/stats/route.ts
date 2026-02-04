import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get global stats
    const globalStats = await prisma.globalStats.findUnique({
      where: { id: 'stats' }
    });

    // Get today's deposits
    const depositsToday = await prisma.transaction.aggregate({
      where: {
        type: 'DEPOSIT',
        status: 'APPROVED',
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get today's withdrawals
    const withdrawsToday = await prisma.transaction.aggregate({
      where: {
        type: 'WITHDRAW',
        status: 'APPROVED',
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get today's bets
    const betsToday = await prisma.bet.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get today's tickets
    const ticketsToday = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get total members
    const totalMembers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });

    // Get active members (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeMembers = await prisma.user.count({
      where: {
        role: 'USER',
        lastLogin: {
          gte: sevenDaysAgo
        }
      }
    });

    // Calculate current liability (pending bets)
    const pendingBets = await prisma.bet.aggregate({
      where: {
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    });

    // Calculate net profit (deposits - withdraws - payouts)
    const totalPayouts = await prisma.ticket.aggregate({
      where: {
        status: 'WIN'
      },
      _sum: {
        winAmount: true
      }
    });

    const netProfit = (globalStats?.totalDeposits || 0) - 
                     (globalStats?.totalWithdrawals || 0) - 
                     (totalPayouts._sum.winAmount || 0);

    const stats = {
      depositToday: depositsToday._sum.amount || 0,
      withdrawToday: withdrawsToday._sum.amount || 0,
      netProfit: netProfit,
      currentLiability: pendingBets._sum.amount || 0,
      totalMembers: totalMembers,
      activeMembers: activeMembers,
      totalBetsToday: betsToday._sum.amount || 0,
      totalTicketsToday: ticketsToday
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
