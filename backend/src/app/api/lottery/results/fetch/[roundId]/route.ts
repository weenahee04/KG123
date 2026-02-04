import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  try {
    const { roundId } = params;

    // TODO: Implement actual API call to external lottery result service
    // This is a placeholder that returns mock data
    // In production, you would call services like:
    // - Ruay API
    // - LottoHub API
    // - Government Lottery API
    // - etc.

    // Mock response
    const mockResult = {
      top3: '123',
      toad3: '456',
      top2: '45',
      bottom2: '67',
      run: '7'
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Fetch result error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch result from external API' },
      { status: 500 }
    );
  }
}
