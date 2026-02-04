import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsuspend member error:', error);
    return NextResponse.json(
      { error: 'Failed to unsuspend member' },
      { status: 500 }
    );
  }
}
