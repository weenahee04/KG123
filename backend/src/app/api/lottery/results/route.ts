import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { roundId, top3, toad3, top2, bottom2, run, confirmedBy } = await request.json();

    if (!roundId || !top3 || !top2 || !bottom2) {
      return NextResponse.json(
        { error: 'Round ID and results are required' },
        { status: 400 }
      );
    }

    // Require 2 admin confirmations
    if (!confirmedBy || confirmedBy.length < 2) {
      return NextResponse.json(
        { error: 'Requires 2 admin confirmations' },
        { status: 400 }
      );
    }

    // Update round with results
    const round = await prisma.lotteryRound.update({
      where: { id: roundId },
      data: {
        resultTop3: top3,
        resultToad3: toad3,
        resultTop2: top2,
        resultBottom2: bottom2,
        resultRun: run,
        status: 'ANNOUNCED'
      }
    });

    return NextResponse.json({ success: true, round });
  } catch (error) {
    console.error('Submit result error:', error);
    return NextResponse.json(
      { error: 'Failed to submit result' },
      { status: 500 }
    );
  }
}
