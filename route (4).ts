import { NextRequest, NextResponse } from 'next/server';
import { getPollOptions, initializeDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');
    if (!pollId) return NextResponse.json({ error: 'pollId required' }, { status: 400 });

    const options = await getPollOptions(parseInt(pollId));
    const totalVotes = options.reduce((a, o) => a + (o.vote_count || 0), 0);
    return NextResponse.json({ options, totalVotes });
  } catch (err) {
    console.error('Results API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
