import { NextRequest, NextResponse } from 'next/server';
import { castVote, getPollOptions, hasUserVoted, hashIP, initializeDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { pollId, optionId, fingerprint, ageGroup, region } = body;

    if (!pollId || !optionId || !fingerprint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limit: check IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';
    const ipHash = hashIP(ip);

    // Combined fingerprint (IP hash + client fingerprint)
    const combinedFp = `${ipHash.substring(0, 16)}_${fingerprint}`;

    // Check already voted
    const alreadyVoted = await hasUserVoted(pollId, combinedFp);
    if (alreadyVoted) {
      const results = await getPollOptions(pollId);
      const totalVotes = results.reduce((a, o) => a + (o.vote_count || 0), 0);
      return NextResponse.json({
        success: false,
        alreadyVoted: true,
        message: 'You have already voted in this poll',
        results,
        totalVotes,
      });
    }

    const result = await castVote(pollId, optionId, ipHash, combinedFp, ageGroup, region);

    if (result.success) {
      const results = await getPollOptions(pollId);
      const totalVotes = results.reduce((a, o) => a + (o.vote_count || 0), 0);
      return NextResponse.json({
        success: true,
        message: 'Vote cast successfully',
        results,
        totalVotes,
      });
    }

    return NextResponse.json({ success: false, message: result.message }, { status: 400 });
  } catch (err) {
    console.error('Vote API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
