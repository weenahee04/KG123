import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  try {
    const { roundId } = params;

    // Get round with results
    const round = await prisma.lotteryRound.findUnique({
      where: { id: roundId }
    });

    if (!round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    if (round.status !== 'ANNOUNCED') {
      return NextResponse.json(
        { error: 'Round must be announced before processing' },
        { status: 400 }
      );
    }

    // Get all pending tickets for this round
    const tickets = await prisma.ticket.findMany({
      where: {
        roundId: roundId,
        status: 'PENDING'
      },
      include: {
        bets: true,
        user: true
      }
    });

    let totalPayout = 0;

    // Process each ticket in a transaction
    await prisma.$transaction(async (tx) => {
      for (const ticket of tickets) {
        let ticketWinAmount = 0;
        let hasWin = false;

        // Check each bet
        for (const bet of ticket.bets) {
          let isWin = false;

          // Check if bet wins
          switch (bet.betType) {
            case '3top':
              isWin = bet.number === round.resultTop3;
              break;
            case '3toad':
              isWin = bet.number === round.resultToad3;
              break;
            case '2top':
              isWin = bet.number === round.resultTop2;
              break;
            case '2bottom':
              isWin = bet.number === round.resultBottom2;
              break;
            case 'run':
              isWin = bet.number === round.resultRun;
              break;
          }

          if (isWin) {
            const winAmount = bet.amount * bet.payout;
            ticketWinAmount += winAmount;
            hasWin = true;

            // Update bet status
            await tx.bet.update({
              where: { id: bet.id },
              data: {
                status: 'WIN',
                winAmount: winAmount
              }
            });
          } else {
            // Update bet status to LOSE
            await tx.bet.update({
              where: { id: bet.id },
              data: {
                status: 'LOSE'
              }
            });
          }
        }

        // Update ticket
        await tx.ticket.update({
          where: { id: ticket.id },
          data: {
            status: hasWin ? 'WIN' : 'LOSE',
            winAmount: ticketWinAmount
          }
        });

        // If ticket wins, credit user balance
        if (hasWin && ticketWinAmount > 0) {
          await tx.user.update({
            where: { id: ticket.userId },
            data: {
              balance: {
                increment: ticketWinAmount
              }
            }
          });

          // Create transaction record
          await tx.transaction.create({
            data: {
              userId: ticket.userId,
              type: 'WIN',
              amount: ticketWinAmount,
              status: 'APPROVED',
              note: `Win from ticket ${ticket.id} - Round ${round.roundNumber}`
            }
          });

          totalPayout += ticketWinAmount;
        }
      }

      // Update round status
      await tx.lotteryRound.update({
        where: { id: roundId },
        data: {
          status: 'PAID'
        }
      });

      // Update global stats
      await tx.globalStats.update({
        where: { id: 'stats' },
        data: {
          totalPayouts: {
            increment: totalPayout
          }
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      totalPayout,
      processedTickets: tickets.length
    });
  } catch (error) {
    console.error('Process results error:', error);
    return NextResponse.json(
      { error: 'Failed to process results' },
      { status: 500 }
    );
  }
}
