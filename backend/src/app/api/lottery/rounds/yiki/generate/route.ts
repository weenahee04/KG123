import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    targetDate.setHours(6, 0, 0, 0);

    const rounds = [];

    // Generate 88 rounds (every 15 minutes from 6:00 to 4:00 next day)
    for (let i = 0; i < 88; i++) {
      const roundTime = new Date(targetDate);
      roundTime.setMinutes(i * 15);

      const closeTime = new Date(roundTime);
      closeTime.setMinutes(closeTime.getMinutes() - 10);

      const openTime = new Date(targetDate);

      const roundNumber = `YIKI-${roundTime.toISOString().split('T')[0].replace(/-/g, '')}-${String(i + 1).padStart(2, '0')}`;

      const round = await prisma.lotteryRound.create({
        data: {
          roundNumber,
          lotteryType: 'YIKI',
          drawDate: roundTime,
          openTime: openTime,
          closeTime: closeTime,
          status: 'WAITING'
        }
      });

      rounds.push(round);
    }

    return NextResponse.json(rounds);
  } catch (error) {
    console.error('Yiki generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Yiki rounds' },
      { status: 500 }
    );
  }
}
