import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { initializeDatabase, seedSampleData } from '@/lib/db';

function getSQL() {
  return neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
}
const sql = getSQL();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initializeDatabase();
    await seedSampleData();

    const { rows } = await sql`
      SELECT 
        id, name, party, state, position, avatar_url,
        approve_count, disapprove_count, neutral_count,
        approve_count + disapprove_count + neutral_count as total_votes,
        CASE WHEN approve_count + disapprove_count + neutral_count > 0
          THEN ROUND((approve_count::numeric / (approve_count + disapprove_count + neutral_count)) * 100, 1)
          ELSE 0
        END as approval_percent,
        CASE WHEN approve_count + disapprove_count + neutral_count > 0
          THEN ROUND((disapprove_count::numeric / (approve_count + disapprove_count + neutral_count)) * 100, 1)
          ELSE 0
        END as disapproval_percent,
        CASE WHEN approve_count + disapprove_count + neutral_count > 0
          THEN ROUND((neutral_count::numeric / (approve_count + disapprove_count + neutral_count)) * 100, 1)
          ELSE 0
        END as neutral_percent,
        ROW_NUMBER() OVER (ORDER BY approve_count DESC) as weekly_rank
      FROM leaders
      ORDER BY approve_count DESC
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Leaders API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
