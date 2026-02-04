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

    await prisma.user.update({
      where: { id },
      data: {
        status: 'SUSPENDED'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Suspend member error:', error);
    return NextResponse.json(
      { error: 'Failed to suspend member' },
      { status: 500 }
    );
  }
}
