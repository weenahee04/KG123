import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const health: {
      bankingApi: 'online' | 'offline' | 'slow';
      lottoApi: 'online' | 'offline' | 'slow';
      database: 'online' | 'offline' | 'slow';
      lastCheck: Date;
    } = {
      bankingApi: 'online',
      lottoApi: 'online',
      database: 'online',
      lastCheck: new Date()
    };

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'online';
    } catch (error) {
      health.database = 'offline';
    }

    // TODO: Test banking API connection
    // This would be actual API call to banking service
    health.bankingApi = 'online';

    // TODO: Test lotto API connection
    // This would be actual API call to lotto result service
    health.lottoApi = 'online';

    return NextResponse.json(health);
  } catch (error) {
    console.error('System health check error:', error);
    return NextResponse.json(
      { 
        bankingApi: 'offline',
        lottoApi: 'offline',
        database: 'offline',
        lastCheck: new Date()
      },
      { status: 500 }
    );
  }
}
