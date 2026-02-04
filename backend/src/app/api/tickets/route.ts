import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roundId = searchParams.get('roundId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (roundId) where.roundId = roundId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        round: {
          select: {
            id: true,
            roundNumber: true,
            lotteryType: true
          }
        },
        bets: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Tickets GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}
