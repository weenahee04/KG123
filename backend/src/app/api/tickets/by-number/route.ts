import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roundId = searchParams.get('roundId');
    const number = searchParams.get('number');
    const betType = searchParams.get('betType');

    if (!roundId || !number || !betType) {
      return NextResponse.json(
        { error: 'Round ID, number, and betType are required' },
        { status: 400 }
      );
    }

    const bets = await prisma.bet.findMany({
      where: {
        number,
        betType,
        ticket: {
          roundId
        }
      },
      include: {
        ticket: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

    const tickets = bets.map(bet => ({
      ...bet.ticket,
      betAmount: bet.amount,
      betPayout: bet.payout
    }));

    return NextResponse.json({
      number,
      betType,
      totalBet,
      tickets
    });
  } catch (error) {
    console.error('Tickets by number error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets by number' },
      { status: 500 }
    );
  }
}
