import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const actionItems = [];

    // Get pending deposits
    const pendingDeposits = await prisma.transaction.findMany({
      where: {
        type: 'DEPOSIT',
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    pendingDeposits.forEach(deposit => {
      actionItems.push({
        id: deposit.id,
        type: 'deposit',
        title: `ฝากเงินรอตรวจสอบ`,
        amount: deposit.amount,
        user: deposit.user.username,
        time: deposit.createdAt,
        priority: deposit.amount > 10000 ? 'high' : 'medium'
      });
    });

    // Get pending withdrawals
    const pendingWithdraws = await prisma.transaction.findMany({
      where: {
        type: 'WITHDRAW',
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    pendingWithdraws.forEach(withdraw => {
      actionItems.push({
        id: withdraw.id,
        type: 'withdraw',
        title: `ถอนเงินรอตรวจสอบ`,
        amount: withdraw.amount,
        user: withdraw.user.username,
        time: withdraw.createdAt,
        priority: withdraw.amount > 50000 ? 'high' : 'medium'
      });
    });

    // Get high risk numbers
    const highRiskNumbers = await prisma.lottoRisk.findMany({
      where: {
        usagePercent: {
          gte: 70
        }
      },
      orderBy: {
        usagePercent: 'desc'
      },
      take: 5
    });

    highRiskNumbers.forEach(risk => {
      actionItems.push({
        id: risk.id,
        type: 'risk',
        title: `เลข ${risk.number} (${risk.betType}) ใกล้ลิมิต`,
        amount: risk.totalBet,
        time: risk.updatedAt,
        priority: risk.usagePercent > 85 ? 'high' : 'medium'
      });
    });

    // Sort by priority and time
    actionItems.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return NextResponse.json(actionItems.slice(0, 20));
  } catch (error) {
    console.error('Dashboard actions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch action items' },
      { status: 500 }
    );
  }
}
