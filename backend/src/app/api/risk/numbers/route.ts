import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const betType = searchParams.get('type');

    const where = betType ? { betType } : {};

    const riskNumbers = await prisma.lottoRisk.findMany({
      where,
      orderBy: [
        { usagePercent: 'desc' },
        { number: 'asc' }
      ]
    });

    return NextResponse.json(riskNumbers);
  } catch (error) {
    console.error('Risk numbers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk numbers' },
      { status: 500 }
    );
  }
}
