import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'config' }
    });

    if (!config) {
      return NextResponse.json(
        { error: 'System config not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Risk config GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const config = await prisma.systemConfig.update({
      where: { id: 'config' },
      data: body
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Risk config PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update risk config' },
      { status: 500 }
    );
  }
}
