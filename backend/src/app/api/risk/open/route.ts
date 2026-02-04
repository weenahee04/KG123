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

    const risk = await prisma.lottoRisk.updateMany({
      where: {
        number,
        betType
      },
      data: {
        manualClosed: false,
        manualLimit: null,
        status: 'safe'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Risk open error:', error);
    return NextResponse.json(
      { error: 'Failed to open number' },
      { status: 500 }
    );
  }
}
