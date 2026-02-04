import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { amount, reason } = await request.json();

    if (amount === undefined || !reason) {
      return NextResponse.json(
        { error: 'Amount and reason are required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update user balance
      const user = await tx.user.update({
        where: { id },
        data: {
          balance: {
            increment: amount
          }
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: id,
          type: amount > 0 ? 'ADJUSTMENT_ADD' : 'ADJUSTMENT_SUBTRACT',
          amount: Math.abs(amount),
          status: 'APPROVED',
          note: reason
        }
      });

      return user;
    });

    return NextResponse.json({ 
      success: true, 
      newBalance: result.balance 
    });
  } catch (error) {
    console.error('Adjust balance error:', error);
    return NextResponse.json(
      { error: 'Failed to adjust balance' },
      { status: 500 }
    );
  }
}
