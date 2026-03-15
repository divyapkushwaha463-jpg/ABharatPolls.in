import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import { Poll, PollOption } from '@/types';

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  return neon(url);
}

export async function initializeDatabase() {
  const sql = getSQL();
  await sql`CREATE TABLE IF NOT EXISTS polls (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, category VARCHAR(50) NOT NULL DEFAULT 'trending', status VARCHAR(20) NOT NULL DEFAULT 'active', expires_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW(), trending_score INTEGER DEFAULT 0)`;
  await sql`CREATE TABLE IF NOT EXISTS poll_options (id SERIAL PRIMARY KEY, poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE, label VARCHAR(255) NOT NULL, party VARCHAR(100), color VARCHAR(20) DEFAULT '#FF6B1A', vote_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS votes (id SERIAL PRIMARY KEY, poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE, option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE, ip_hash VARCHAR(64) NOT NULL, fingerprint VARCHAR(64) NOT NULL, age_group VARCHAR(20), region VARCHAR(100), created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(poll_id, fingerprint))`;
  await sql`CREATE TABLE IF NOT EXISTS leaders (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, party VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL, position VARCHAR(200), avatar_url TEXT, approve_count INTEGER DEFAULT 0, disapprove_count INTEGER DEFAULT 0, neutral_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS elections (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, state VARCHAR(100) NOT NULL, election_date DATE NOT NULL, type VARCHAR(50) NOT NULL DEFAULT 'assembly', description TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_votes_fingerprint ON votes(fingerprint)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_polls_category ON polls(category)`;
}

export async function getAllPolls(category?: string, status?: string): Promise<Poll[]> {
  const sql = getSQL();
  let rows;
  if (category && status) {
    rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id WHERE p.category = ${category} AND p.status = ${status} GROUP BY p.id ORDER BY p.trending_score DESC, p.created_at DESC LIMIT 20`;
  } else if (category) {
    rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id WHERE p.category = ${category} GROUP BY p.id ORDER BY p.trending_score DESC, p.created_at DESC LIMIT 20`;
  } else if (status) {
    rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id WHERE p.status = ${status} GROUP BY p.id ORDER BY p.trending_score DESC, p.created_at DESC LIMIT 20`;
  } else {
    rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id GROUP BY p.id ORDER BY p.trending_score DESC, p.created_at DESC LIMIT 20`;
  }
  return rows as Poll[];
}

export async function getTrendingPolls(limit = 6): Promise<Poll[]> {
  const sql = getSQL();
  const rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id WHERE p.status = 'active' GROUP BY p.id ORDER BY ((SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id AND v.created_at > NOW() - INTERVAL '24 hours') * 3 + p.trending_score) DESC LIMIT ${limit}`;
  return rows as Poll[];
}

export async function getPollById(id: number): Promise<Poll | null> {
  const sql = getSQL();
  const rows = await sql`SELECT p.*, COALESCE(SUM(po.vote_count), 0) as total_votes FROM polls p LEFT JOIN poll_options po ON p.id = po.poll_id WHERE p.id = ${id} GROUP BY p.id`;
  if (!rows[0]) return null;
  const poll = rows[0] as Poll;
  poll.options = await getPollOptions(id);
  return poll;
}

export async function getPollOptions(pollId: number): Promise<PollOption[]> {
  const sql = getSQL();
  const rows = await sql`SELECT po.*, CASE WHEN SUM(po.vote_count) OVER () > 0 THEN ROUND((po.vote_count::numeric / SUM(po.vote_count) OVER ()) * 100, 1) ELSE 0 END as percentage FROM poll_options po WHERE po.poll_id = ${pollId} ORDER BY po.vote_count DESC`;
  return rows as PollOption[];
}

export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.VOTE_SALT || 'bharat-salt')).digest('hex');
}

export async function hasUserVoted(pollId: number, fingerprint: string): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql`SELECT id FROM votes WHERE poll_id = ${pollId} AND fingerprint = ${fingerprint} LIMIT 1`;
  return rows.length > 0;
}

export async function castVote(pollId: number, optionId: number, ipHash: string, fingerprint: string, ageGroup?: string, region?: string): Promise<{ success: boolean; message: string }> {
  const sql = getSQL();
  try {
    const alreadyVoted = await hasUserVoted(pollId, fingerprint);
    if (alreadyVoted) return { success: false, message: 'Already voted' };
    const pollRows = await sql`SELECT status, expires_at FROM polls WHERE id = ${pollId}`;
    if (!pollRows[0]) return { success: false, message: 'Poll not found' };
    if (pollRows[0].status !== 'active') return { success: false, message: 'Poll is closed' };
    if (pollRows[0].expires_at && new Date(pollRows[0].expires_at as string) < new Date()) {
      await sql`UPDATE polls SET status = 'closed' WHERE id = ${pollId}`;
      return { success: false, message: 'Poll has expired' };
    }
    await sql`INSERT INTO votes (poll_id, option_id, ip_hash, fingerprint, age_group, region) VALUES (${pollId}, ${optionId}, ${ipHash}, ${fingerprint}, ${ageGroup || null}, ${region || null})`;
    await sql`UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ${optionId} AND poll_id = ${pollId}`;
    await sql`UPDATE polls SET trending_score = trending_score + 1 WHERE id = ${pollId}`;
    return { success: true, message: 'Vote cast successfully' };
  } catch (err: unknown) {
    if (err instanceof Error && err.message?.includes('unique')) return { success: false, message: 'Already voted' };
    console.error('Vote error:', err);
    return { success: false, message: 'Error casting vote' };
  }
}

export async function createPoll(data: { title: string; description: string; category: string; status: string; expires_at?: string; options: { label: string; party?: string; color: string }[] }) {
  const sql = getSQL();
  const rows = await sql`INSERT INTO polls (title, description, category, status, expires_at) VALUES (${data.title}, ${data.description}, ${data.category}, ${data.status}, ${data.expires_at || null}) RETURNING id`;
  const pollId = rows[0].id as number;
  for (const opt of data.options) {
    await sql`INSERT INTO poll_options (poll_id, label, party, color) VALUES (${pollId}, ${opt.label}, ${opt.party || null}, ${opt.color})`;
  }
  return pollId;
}

export async function deletePoll(id: number) {
  const sql = getSQL();
  await sql`DELETE FROM polls WHERE id = ${id}`;
}

export async function getAdminStats() {
  const sql = getSQL();
  const rows = await sql`SELECT (SELECT COUNT(*) FROM polls)::int as total_polls, (SELECT COALESCE(SUM(vote_count), 0) FROM poll_options)::int as total_votes, (SELECT COUNT(*) FROM votes WHERE created_at > NOW() - INTERVAL '24 hours')::int as votes_today`;
  return rows[0];
}

export async function seedSampleData() {
  const sql = getSQL();
  const rows = await sql`SELECT COUNT(*) as count FROM polls`;
  if (parseInt(rows[0].count as string) > 0) return;

  const polls = [
    { title: 'Who will win UP Assembly 2027?', description: 'Cast your vote for the next UP Chief Minister', category: 'election', status: 'active', options: [{ label: 'BJP', party: 'Bharatiya Janata Party', color: '#FF6B1A' }, { label: 'Samajwadi Party', party: 'SP', color: '#E41E30' }, { label: 'BSP', party: 'Bahujan Samaj Party', color: '#0047AB' }, { label: 'Congress', party: 'Indian National Congress', color: '#138808' }] },
    { title: "Who is Youth's Favorite Leader in 2026?", description: 'Vote for the leader you trust the most', category: 'youth', status: 'active', options: [{ label: 'Narendra Modi', party: 'BJP', color: '#FF6B1A' }, { label: 'Rahul Gandhi', party: 'Congress', color: '#138808' }, { label: 'Yogi Adityanath', party: 'BJP', color: '#FF8C00' }, { label: 'Arvind Kejriwal', party: 'AAP', color: '#1E40AF' }] },
    { title: 'Delhi Assembly Election 2025 – Who Should Win?', description: 'Which party deserves to govern Delhi?', category: 'election', status: 'active', options: [{ label: 'AAP', party: 'Aam Aadmi Party', color: '#1E40AF' }, { label: 'BJP', party: 'Bharatiya Janata Party', color: '#FF6B1A' }, { label: 'Congress', party: 'Indian National Congress', color: '#138808' }, { label: 'Others', party: 'Others', color: '#6B7280' }] },
    { title: 'Do You Approve the Current Central Government?', description: 'Rate the performance of the current government', category: 'policy', status: 'active', options: [{ label: 'Strongly Approve', party: '', color: '#15803D' }, { label: 'Approve', party: '', color: '#84CC16' }, { label: 'Disapprove', party: '', color: '#EF4444' }, { label: 'Strongly Disapprove', party: '', color: '#B91C1C' }] },
    { title: 'Bihar Assembly 2025 – Which Alliance Will Win?', description: 'NDA vs INDIA Alliance in Bihar', category: 'election', status: 'active', options: [{ label: 'NDA Alliance', party: 'BJP + JDU', color: '#FF6B1A' }, { label: 'INDIA Alliance', party: 'RJD + Congress', color: '#E41E30' }, { label: 'Others', party: '', color: '#6B7280' }] },
    { title: 'Best PM Candidate for Lok Sabha 2029?', description: 'Who should lead India after 2029 elections?', category: 'trending', status: 'active', options: [{ label: 'Narendra Modi', party: 'BJP', color: '#FF6B1A' }, { label: 'Rahul Gandhi', party: 'Congress', color: '#138808' }, { label: 'Nitish Kumar', party: 'JDU', color: '#10B981' }, { label: 'Mamata Banerjee', party: 'TMC', color: '#3B82F6' }] },
  ];

  for (const poll of polls) {
    const pollId = await createPoll(poll);
    const optionRows = await sql`SELECT id FROM poll_options WHERE poll_id = ${pollId} ORDER BY id`;
    for (const row of optionRows) {
      const count = Math.floor(Math.random() * 5000) + 500;
      await sql`UPDATE poll_options SET vote_count = ${count} WHERE id = ${row.id}`;
    }
    const totalRes = await sql`SELECT SUM(vote_count) as t FROM poll_options WHERE poll_id = ${pollId}`;
    await sql`UPDATE polls SET trending_score = ${totalRes[0].t} WHERE id = ${pollId}`;
  }

  const leaders = [
    { name: 'Narendra Modi', party: 'BJP', state: 'Gujarat', position: 'Prime Minister of India', a: 58, d: 28, n: 14 },
    { name: 'Rahul Gandhi', party: 'Congress', state: 'Kerala', position: 'Leader of Opposition', a: 44, d: 38, n: 18 },
    { name: 'Yogi Adityanath', party: 'BJP', state: 'Uttar Pradesh', position: 'Chief Minister, UP', a: 52, d: 31, n: 17 },
    { name: 'Arvind Kejriwal', party: 'AAP', state: 'Delhi', position: 'National Convenor, AAP', a: 46, d: 36, n: 18 },
    { name: 'Mamata Banerjee', party: 'TMC', state: 'West Bengal', position: 'Chief Minister, WB', a: 51, d: 35, n: 14 },
    { name: 'Akhilesh Yadav', party: 'SP', state: 'Uttar Pradesh', position: 'President, Samajwadi Party', a: 42, d: 40, n: 18 },
  ];
  for (const l of leaders) {
    const t = 10000 + Math.floor(Math.random() * 5000);
    await sql`INSERT INTO leaders (name, party, state, position, approve_count, disapprove_count, neutral_count) VALUES (${l.name}, ${l.party}, ${l.state}, ${l.position}, ${Math.round(t * l.a / 100)}, ${Math.round(t * l.d / 100)}, ${Math.round(t * l.n / 100)})`;
  }

  const elections = [
    { name: 'UP Assembly Election 2027', state: 'Uttar Pradesh', date: '2027-02-10', type: 'assembly' },
    { name: 'Delhi Assembly Election 2025', state: 'Delhi', date: '2025-11-15', type: 'assembly' },
    { name: 'Bihar Assembly Election 2025', state: 'Bihar', date: '2025-10-20', type: 'assembly' },
    { name: 'Lok Sabha Election 2029', state: 'National', date: '2029-05-01', type: 'lok_sabha' },
    { name: 'Rajasthan Assembly 2028', state: 'Rajasthan', date: '2028-12-01', type: 'assembly' },
  ];
  for (const e of elections) {
    await sql`INSERT INTO elections (name, state, election_date, type) VALUES (${e.name}, ${e.state}, ${e.date}, ${e.type})`;
  }
}
