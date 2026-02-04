import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { number, betType, limit } = await request.json();

    if (!number || !betType || limit === undefined) {
      return NextResponse.json(
        { error: 'Number, betType, and limit are required' },
        { status: 400 }
      );
    }

    const risk = await prisma.lottoRisk.upsert({
      where: {
        number_betType: {
          number,
          betType
        }
      },
      update: {
        manualLimit: limit
      },
      create: {
        number,
        betType,
        totalBet: 0,
        maxLimit: 0,
        usagePercent: 0,
        status: 'safe',
        currentPayout: 0,
        manualClosed: false,
        manualLimit: limit
      }
    });

    return NextResponse.json({ success: true, risk });
  } catch (error) {
    console.error('Risk limit error:', error);
    return NextResponse.json(
      { error: 'Failed to set manual limit' },
      { status: 500 }
    );
  }
}
