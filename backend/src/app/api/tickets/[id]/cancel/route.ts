import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { round: true }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (ticket.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only cancel pending tickets' },
        { status: 400 }
      );
    }

    // Check if round is still open
    if (ticket.round.status !== 'OPEN' && ticket.round.status !== 'WAITING') {
      return NextResponse.json(
        { error: 'Cannot cancel ticket after round is closed' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update ticket status
      await tx.ticket.update({
        where: { id },
        data: {
          status: 'CANCELLED'
        }
      });

      // Refund user balance
      await tx.user.update({
        where: { id: ticket.userId },
        data: {
          balance: {
            increment: ticket.totalAmount
          }
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: ticket.userId,
          type: 'REFUND',
          amount: ticket.totalAmount,
          status: 'APPROVED',
          note: `Ticket cancelled: ${reason}`
        }
      });

      // Update risk numbers (decrease totalBet)
      const bets = await tx.bet.findMany({
        where: { ticketId: id }
      });

      for (const bet of bets) {
        await tx.lottoRisk.updateMany({
          where: {
            number: bet.number,
            betType: bet.betType
          },
          data: {
            totalBet: {
              decrement: bet.amount
            }
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel ticket' },
      { status: 500 }
    );
  }
}
