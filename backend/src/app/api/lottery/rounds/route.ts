import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const rounds = await prisma.lotteryRound.findMany({
      where,
      orderBy: {
        drawDate: 'desc'
      },
      include: {
        _count: {
          select: {
            tickets: true
          }
        }
      }
    });

    // Calculate totalBets and totalTickets for each round
    const roundsWithStats = await Promise.all(
      rounds.map(async (round) => {
        const betsSum = await prisma.ticket.aggregate({
          where: { roundId: round.id },
          _sum: { totalAmount: true }
        });

        const payoutSum = await prisma.ticket.aggregate({
          where: { 
            roundId: round.id,
            status: 'WIN'
          },
          _sum: { winAmount: true }
        });

        return {
          ...round,
          totalBets: betsSum._sum.totalAmount || 0,
          totalPayout: payoutSum._sum.winAmount || 0,
          totalTickets: round._count.tickets
        };
      })
    );

    return NextResponse.json(roundsWithStats);
  } catch (error) {
    console.error('Lottery rounds GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lottery rounds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lotteryType, drawDate, openTime, closeTime } = await request.json();

    if (!lotteryType || !drawDate || !openTime || !closeTime) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate round number
    const date = new Date(drawDate);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const roundNumber = `${lotteryType}-${dateStr}`;

    const round = await prisma.lotteryRound.create({
      data: {
        roundNumber,
        lotteryType,
        drawDate: new Date(drawDate),
        openTime: new Date(openTime),
        closeTime: new Date(closeTime),
        status: 'WAITING'
      }
    });

    return NextResponse.json(round);
  } catch (error) {
    console.error('Lottery rounds POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create lottery round' },
      { status: 500 }
    );
  }
}
