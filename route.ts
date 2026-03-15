import { NextRequest, NextResponse } from 'next/server';
import { createPoll, deletePoll, getAdminStats, getAllPolls, initializeDatabase, seedSampleData } from '@/lib/db';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);

export const dynamic = 'force-dynamic';

// Simple admin token check (in production, use proper auth)
function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token') || request.nextUrl.searchParams.get('token');
  return token === (process.env.ADMIN_TOKEN || 'bharatpolls-admin-2026');
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    await seedSampleData();

    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = await getAdminStats();
      const polls = await getAllPolls();
      const { rows: leaders } = await sql`SELECT * FROM leaders ORDER BY approve_count DESC LIMIT 6`;
      return NextResponse.json({ stats, polls, leaders });
    }

    const polls = await getAllPolls();
    return NextResponse.json(polls);
  } catch (err) {
    console.error('Admin GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'create') {
      const id = await createPoll(data);
      return NextResponse.json({ success: true, id });
    }

    if (action === 'delete') {
      await deletePoll(data.id);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_status') {
      await sql`UPDATE polls SET status = ${data.status} WHERE id = ${data.id}`;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Admin POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
