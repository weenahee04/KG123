import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if round has tickets
    const ticketCount = await prisma.ticket.count({
      where: { roundId: id }
    });

    if (ticketCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete round with existing tickets' },
        { status: 400 }
      );
    }

    // Delete round
    await prisma.lotteryRound.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete round error:', error);
    return NextResponse.json(
      { error: 'Failed to delete round' },
      { status: 500 }
    );
  }
}
