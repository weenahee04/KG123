import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { note } = await request.json();

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Transaction is not pending' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update transaction status
      await tx.transaction.update({
        where: { id },
        data: {
          status: 'APPROVED',
          processedAt: new Date(),
          note: note || undefined
        }
      });

      // Update user balance based on transaction type
      if (transaction.type === 'DEPOSIT') {
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            balance: {
              increment: transaction.amount
            }
          }
        });

        // Update global stats
        await tx.globalStats.update({
          where: { id: 'stats' },
          data: {
            totalDeposits: {
              increment: transaction.amount
            }
          }
        });
      } else if (transaction.type === 'WITHDRAW') {
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            balance: {
              decrement: transaction.amount
            }
          }
        });

        // Update global stats
        await tx.globalStats.update({
          where: { id: 'stats' },
          data: {
            totalWithdrawals: {
              increment: transaction.amount
            }
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to approve transaction' },
      { status: 500 }
    );
  }
}
