import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { number, betType } = await request.json();

    if (!number || !betType) {
      return NextResponse.json(
        { error: 'Number and betType are required' },
        { status: 400 }
      );
    }

    // Find or create risk record
    const risk = await prisma.lottoRisk.upsert({
      where: {
        number_betType: {
          number,
          betType
        }
      },
      update: {
        manualClosed: true,
        status: 'closed'
      },
      create: {
        number,
        betType,
        totalBet: 0,
        maxLimit: 0,
        usagePercent: 0,
        status: 'closed',
        currentPayout: 0,
        manualClosed: true
      }
    });

    return NextResponse.json({ success: true, risk });
  } catch (error) {
    console.error('Risk close error:', error);
    return NextResponse.json(
      { error: 'Failed to close number' },
      { status: 500 }
    );
  }
}
