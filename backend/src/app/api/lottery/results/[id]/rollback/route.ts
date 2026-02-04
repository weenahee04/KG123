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

    if (round.status !== 'ANNOUNCED' && round.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Can only rollback announced or paid rounds' },
        { status: 400 }
      );
    }

    // Get all winning tickets
    const winningTickets = await prisma.ticket.findMany({
      where: {
        roundId: id,
        status: 'WIN'
      },
      include: {
        user: true
      }
    });

    let totalRollback = 0;

    // Rollback in a transaction
    await prisma.$transaction(async (tx) => {
      for (const ticket of winningTickets) {
        if (ticket.winAmount && ticket.winAmount > 0) {
          // Deduct from user balance
          await tx.user.update({
            where: { id: ticket.userId },
            data: {
              balance: {
                decrement: ticket.winAmount
              }
            }
          });

          // Create transaction record
          await tx.transaction.create({
            data: {
              userId: ticket.userId,
              type: 'ROLLBACK',
              amount: -ticket.winAmount,
              status: 'APPROVED',
              note: `Rollback for round ${round.roundNumber} - Result correction`
            }
          });

          totalRollback += ticket.winAmount;
        }

        // Reset ticket status
        await tx.ticket.update({
          where: { id: ticket.id },
          data: {
            status: 'PENDING',
            winAmount: 0
          }
        });

        // Reset all bets
        await tx.bet.updateMany({
          where: { ticketId: ticket.id },
          data: {
            status: 'PENDING',
            winAmount: 0
          }
        });
      }

      // Clear round results and set back to CLOSED
      await tx.lotteryRound.update({
        where: { id },
        data: {
          status: 'CLOSED',
          resultTop3: null,
          resultToad3: null,
          resultTop2: null,
          resultBottom2: null,
          resultRun: null
        }
      });

      // Update global stats
      await tx.globalStats.update({
        where: { id: 'stats' },
        data: {
          totalPayouts: {
            decrement: totalRollback
          }
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      totalRollback,
      rolledBackTickets: winningTickets.length
    });
  } catch (error) {
    console.error('Rollback result error:', error);
    return NextResponse.json(
      { error: 'Failed to rollback result' },
      { status: 500 }
    );
  }
}
