import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const where: any = {
      role: 'USER'
    };

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const members = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        fullName: true,
        phone: true,
        balance: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        referralCode: true,
        referredBy: true,
        _count: {
          select: {
            tickets: true,
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate totals for each member
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const deposits = await prisma.transaction.aggregate({
          where: {
            userId: member.id,
            type: 'DEPOSIT',
            status: 'APPROVED'
          },
          _sum: { amount: true }
        });

        const withdraws = await prisma.transaction.aggregate({
          where: {
            userId: member.id,
            type: 'WITHDRAW',
            status: 'APPROVED'
          },
          _sum: { amount: true }
        });

        const bets = await prisma.ticket.aggregate({
          where: { userId: member.id },
          _sum: { totalAmount: true }
        });

        return {
          ...member,
          totalDeposit: deposits._sum.amount || 0,
          totalWithdraw: withdraws._sum.amount || 0,
          totalBets: bets._sum.totalAmount || 0
        };
      })
    );

    return NextResponse.json(membersWithStats);
  } catch (error) {
    console.error('Members GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}
