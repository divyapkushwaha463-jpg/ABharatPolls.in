import { NextRequest, NextResponse } from 'next/server';
import { getAllPolls, getTrendingPolls, getPollById, initializeDatabase, seedSampleData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    await seedSampleData();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const trending = searchParams.get('trending');

    if (id) {
      const poll = await getPollById(parseInt(id));
      if (!poll) return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      return NextResponse.json(poll);
    }

    if (trending) {
      const polls = await getTrendingPolls(parseInt(trending) || 6);
      return NextResponse.json(polls);
    }

    const polls = await getAllPolls(category, status);
    return NextResponse.json(polls);
  } catch (err) {
    console.error('Polls API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
