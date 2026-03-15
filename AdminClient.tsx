'use client';

import { useState, useEffect, useCallback } from 'react';
import { Poll } from '@/types';

const ADMIN_TOKEN = 'bharatpolls-admin-2026';

const OPTION_COLORS = ['#FF6B1A', '#138808', '#E41E30', '#1E40AF', '#F59E0B', '#8B5CF6'];

interface AdminStats {
  total_polls: number;
  total_votes: number;
  votes_today: number;
}

export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'create' | 'polls'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Create poll form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'election',
    status: 'active',
    expires_at: '',
    options: [
      { label: '', party: '', color: '#FF6B1A' },
      { label: '', party: '', color: '#138808' },
    ],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?action=stats&token=${ADMIN_TOKEN}`);
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.polls) setPolls(data.polls);
    } catch {/* */}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (token === ADMIN_TOKEN) { setAuthed(true); }
    else { setMsg('Invalid admin token'); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const validOptions = form.options.filter(o => o.label.trim());
    if (validOptions.length < 2) { setMsg('Need at least 2 options'); return; }

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({ action: 'create', ...form, options: validOptions }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg('✅ Poll created successfully!');
      setForm({ title: '', description: '', category: 'election', status: 'active', expires_at: '', options: [{ label: '', party: '', color: '#FF6B1A' }, { label: '', party: '', color: '#138808' }] });
      loadData();
    } else setMsg('Error creating poll');
  }

  async function deletePoll(id: number) {
    if (!confirm('Delete this poll?')) return;
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({ action: 'delete', id }),
    });
    const data = await res.json();
    if (data.success) { setMsg('Poll deleted'); loadData(); }
  }

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border p-8" style={{ background: 'rgba(14,21,40,0.9)', borderColor: 'rgba(255,107,26,0.2)' }}>
            <div className="text-center mb-6">
              <span className="text-4xl block mb-3">⚙️</span>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Admin Panel</h1>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Hind, sans-serif' }}>Enter admin token to continue</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Admin Token"
                className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500"
                style={{ borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'Hind, sans-serif' }}
              />
              {msg && <p className="text-red-400 text-sm text-center">{msg}</p>}
              <button type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)', fontFamily: 'Rajdhani, sans-serif' }}>
                Login →
              </button>
              <p className="text-gray-600 text-xs text-center" style={{ fontFamily: 'Hind, sans-serif' }}>
                Default: bharatpolls-admin-2026
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          ⚙️ Admin Dashboard
        </h1>
        <span className="text-xs px-3 py-1 rounded-full font-bold text-emerald-400"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontFamily: 'Rajdhani, sans-serif' }}>
          ● Authenticated
        </span>
      </div>

      {msg && (
        <div className="mb-6 p-4 rounded-xl border text-sm font-bold"
          style={{ background: 'rgba(255,107,26,0.1)', borderColor: 'rgba(255,107,26,0.3)', color: '#FF8C42', fontFamily: 'Rajdhani, sans-serif' }}>
          {msg}
          <button onClick={() => setMsg('')} className="ml-4 text-gray-400">✕</button>
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Polls', value: stats.total_polls, icon: '📊', color: '#FF6B1A' },
            { label: 'Total Votes', value: (stats.total_votes || 0).toLocaleString('en-IN'), icon: '🗳️', color: '#138808' },
            { label: 'Votes Today', value: (stats.votes_today || 0).toLocaleString('en-IN'), icon: '⚡', color: '#3B82F6' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-5 border text-center"
              style={{ background: `${stat.color}08`, borderColor: `${stat.color}25` }}>
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-2xl font-black" style={{ color: stat.color, fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px' }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-dark-800 p-1 rounded-xl w-fit">
        {(['dashboard', 'create', 'polls'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
              tab === t ? 'bg-saffron-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {t === 'dashboard' ? '📊 Dashboard' : t === 'create' ? '➕ Create Poll' : '📋 Manage Polls'}
          </button>
        ))}
      </div>

      {/* Tab: Create Poll */}
      {tab === 'create' && (
        <div className="rounded-2xl border p-6 max-w-2xl"
          style={{ background: 'rgba(14,21,40,0.7)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            ➕ Create New Poll
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Poll Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                placeholder="Who will win UP Assembly 2027?"
                className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500"
                style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }} />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Optional description..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500 resize-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white focus:outline-none focus:border-saffron-500"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }}>
                  {['election', 'leader', 'policy', 'youth', 'trending'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white focus:outline-none focus:border-saffron-500"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }}>
                  {['active', 'upcoming', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Expiry Date (optional)</label>
              <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border bg-dark-700 text-white focus:outline-none focus:border-saffron-500"
                style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif', colorScheme: 'dark' }} />
            </div>

            {/* Options */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Poll Options (min 2)
              </label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={opt.label} onChange={e => setForm(f => ({ ...f, options: f.options.map((o, j) => j === i ? { ...o, label: e.target.value } : o) }))}
                    placeholder={`Option ${i + 1} *`}
                    className="flex-1 px-3 py-2 rounded-lg border bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500 text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }} />
                  <input value={opt.party} onChange={e => setForm(f => ({ ...f, options: f.options.map((o, j) => j === i ? { ...o, party: e.target.value } : o) }))}
                    placeholder="Party"
                    className="w-24 px-3 py-2 rounded-lg border bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500 text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'Hind, sans-serif' }} />
                  <input type="color" value={opt.color} onChange={e => setForm(f => ({ ...f, options: f.options.map((o, j) => j === i ? { ...o, color: e.target.value } : o) }))}
                    className="w-10 h-10 rounded-lg border cursor-pointer bg-dark-700"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  {i > 1 && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, options: f.options.filter((_, j) => j !== i) }))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {form.options.length < 6 && (
                <button type="button"
                  onClick={() => setForm(f => ({ ...f, options: [...f.options, { label: '', party: '', color: OPTION_COLORS[f.options.length] || '#6B7280' }] }))}
                  className="text-sm text-saffron-400 hover:text-saffron-300 font-bold mt-1"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  + Add Option
                </button>
              )}
            </div>

            <button type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-lg mt-2"
              style={{ background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)', fontFamily: 'Rajdhani, sans-serif' }}>
              🚀 Create Poll
            </button>
          </form>
        </div>
      )}

      {/* Tab: Manage Polls */}
      {tab === 'polls' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              All Polls ({polls.length})
            </h2>
            <button onClick={loadData} className="text-sm text-saffron-400 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {polls.map(poll => (
                <div key={poll.id} className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: 'rgba(14,21,40,0.7)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {poll.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
                        #{poll.id} · {poll.category} · {poll.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        🗳 {(poll.total_votes || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      poll.status === 'active' ? 'bg-green-500/10 text-green-400' :
                      poll.status === 'closed' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {poll.status}
                    </span>
                    <a href={`/polls/${poll.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-saffron-400 border border-saffron-500/30 hover:bg-saffron-500/10 transition-colors"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      View
                    </a>
                    <button onClick={() => deletePoll(poll.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Dashboard */}
      {tab === 'dashboard' && (
        <div className="text-center py-10 text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
          <p className="text-4xl mb-4">📊</p>
          <p>Dashboard loaded. Stats shown above.</p>
          <p className="text-sm mt-2">Use tabs to create or manage polls.</p>
        </div>
      )}
    </div>
  );
}
