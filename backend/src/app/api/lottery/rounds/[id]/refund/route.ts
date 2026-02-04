import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get round
    const round = await prisma.lotteryRound.findUnique({
      where: { id }
    });

    if (!round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    // Get all tickets for this round
    const tickets = await prisma.ticket.findMany({
      where: {
        roundId: id,
        status: { in: ['PENDING', 'LOSE'] }
      },
      include: {
        user: true
      }
    });

    let totalRefund = 0;

    // Refund all tickets in a transaction
    await prisma.$transaction(async (tx) => {
      for (const ticket of tickets) {
        // Credit user balance
        await tx.user.update({
          where: { id: ticket.userId },
          data: {
            balance: {
              increment: ticket.totalAmount
            }
          }
        });

        // Update ticket status
        await tx.ticket.update({
          where: { id: ticket.id },
          data: {
            status: 'REFUNDED'
          }
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: ticket.userId,
            type: 'REFUND',
            amount: ticket.totalAmount,
            status: 'APPROVED',
            note: `Refund for round ${round.roundNumber}`
          }
        });

        totalRefund += ticket.totalAmount;
      }

      // Update round status
      await tx.lotteryRound.update({
        where: { id },
        data: {
          status: 'PAID'
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      totalRefund,
      refundedTickets: tickets.length
    });
  } catch (error) {
    console.error('Refund round error:', error);
    return NextResponse.json(
      { error: 'Failed to refund round' },
      { status: 500 }
    );
  }
}
