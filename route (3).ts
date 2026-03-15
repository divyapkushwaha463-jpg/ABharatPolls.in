import { NextResponse } from 'next/server';
import { initializeDatabase, seedSampleData } from '@/lib/db';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initializeDatabase();
    await seedSampleData();

    const { rows } = await sql`
      SELECT * FROM elections ORDER BY election_date ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Elections API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
