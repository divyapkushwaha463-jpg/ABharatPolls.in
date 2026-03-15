# 🇮🇳 BharatPolls.in

**India's Public Opinion Poll Platform** — Real-time political polls, election predictions, and youth voice.

---

## 🚀 Quick Deploy to Vercel

### Step 1: Clone & Install

```bash
git clone https://github.com/yourname/bharatpolls
cd bharatpolls
npm install
```

### Step 2: Create Vercel Postgres Database

1. Go to [vercel.com](https://vercel.com) → Your Project → **Storage**
2. Click **Create Database** → Choose **Postgres**
3. Name it `bharatpolls-db`, click Create
4. Go to **Settings** → copy all environment variables

### Step 3: Set Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

For local dev, fill in your Vercel Postgres credentials from the dashboard.

### Step 4: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> The database tables and sample data are automatically seeded on first API call.

### Step 5: Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deployments.

---

## 📁 Project Structure

```
bharatpolls/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout + metadata
│   ├── globals.css               # Global styles + animations
│   ├── polls/[id]/page.tsx       # Individual poll page
│   ├── elections/page.tsx        # All election polls
│   ├── leaders/page.tsx          # Leader popularity rankings
│   ├── admin/page.tsx            # Admin panel
│   └── api/
│       ├── polls/route.ts        # GET polls (all, trending, by id)
│       ├── vote/route.ts         # POST vote (with dedup)
│       ├── results/route.ts      # GET poll results
│       ├── leaders/route.ts      # GET leader rankings
│       ├── elections/route.ts    # GET upcoming elections
│       └── admin/route.ts        # Admin CRUD + analytics
├── components/
│   ├── Navbar.tsx                # Sticky nav with mobile menu
│   ├── Footer.tsx                # Footer with links
│   ├── NewsTicker.tsx            # Live news ticker
│   ├── HeroSection.tsx           # Homepage hero + stats
│   ├── TrendingPolls.tsx         # Trending polls grid
│   ├── UpcomingElections.tsx     # Election countdown cards
│   ├── YouthLeaderPolls.tsx      # Youth polls section
│   ├── LatestResults.tsx         # Results with chart switcher
│   ├── PollCard.tsx              # Voteable poll card
│   ├── PollDetailClient.tsx      # Full poll page with charts
│   ├── ElectionsClient.tsx       # Elections page with filters
│   ├── LeadersClient.tsx         # Leaders ranking page
│   ├── AdminClient.tsx           # Admin dashboard
│   ├── BarChart.tsx              # Chart.js bar chart
│   ├── PieChart.tsx              # Chart.js doughnut chart
│   ├── CountdownTimer.tsx        # Live poll countdown
│   └── ShareButtons.tsx          # WhatsApp/Twitter/Telegram share
├── lib/
│   └── db.ts                     # All Vercel Postgres queries
├── types/
│   └── index.ts                  # TypeScript interfaces
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── vercel.json                   # Vercel deployment config
├── tailwind.config.ts            # Tailwind + custom theme
└── next.config.js                # Next.js config
```

---

## 🗄️ Database Schema

### `polls`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | VARCHAR(255) | Poll question |
| description | TEXT | Optional description |
| category | VARCHAR(50) | election/leader/policy/youth/trending |
| status | VARCHAR(20) | active/closed/upcoming |
| expires_at | TIMESTAMPTZ | Optional expiry |
| trending_score | INTEGER | Vote-based trending rank |

### `poll_options`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| poll_id | INTEGER | FK → polls |
| label | VARCHAR(255) | Option name |
| party | VARCHAR(100) | Party name |
| color | VARCHAR(20) | Hex color |
| vote_count | INTEGER | Total votes |

### `votes`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| poll_id | INTEGER | FK → polls |
| option_id | INTEGER | FK → poll_options |
| ip_hash | VARCHAR(64) | SHA-256 hashed IP |
| fingerprint | VARCHAR(64) | IP hash + browser fingerprint |
| age_group | VARCHAR(20) | Optional: 18-25, 26-35... |
| UNIQUE | (poll_id, fingerprint) | One vote per poll |

### `leaders`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Leader name |
| party | VARCHAR(100) | Political party |
| approve_count | INTEGER | Approval votes |
| disapprove_count | INTEGER | Disapproval votes |

### `elections`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Election name |
| state | VARCHAR(100) | State |
| election_date | DATE | Date of election |
| type | VARCHAR(50) | assembly/lok_sabha/bypolls |

---

## 🛡️ Anti-Spam / Vote Integrity

One person, one vote per poll using:

1. **IP Hashing** — SHA-256 hash of IP + secret salt (no raw IP stored)
2. **Browser Fingerprint** — User agent + screen size + timezone combined
3. **Combined fingerprint** — `ipHash[:16]_clientFp` — stored in DB
4. **localStorage** — Client-side duplicate prevention (instant UX)
5. **DB UNIQUE constraint** — `(poll_id, fingerprint)` — server-side guarantee
6. **Rate limiting ready** — Add Cloudflare Turnstile for extra protection

---

## ⚙️ Admin Panel

Visit `/admin` — default token: `bharatpolls-admin-2026`

**Change the token** in your `.env.local`:
```
ADMIN_TOKEN=your-secret-token-here
```

Admin can:
- ✅ View total votes, daily votes, poll count
- ✅ Create new polls with custom options + colors
- ✅ Delete polls
- ✅ View all polls with status

---

## 📊 API Reference

### `GET /api/polls`
- `?trending=6` — top 6 trending polls
- `?id=1` — single poll with options + results
- `?category=election` — filter by category
- `?status=active` — filter by status

### `POST /api/vote`
```json
{
  "pollId": 1,
  "optionId": 3,
  "fingerprint": "abc123",
  "ageGroup": "18-25"
}
```

### `GET /api/results?pollId=1`
Returns options with vote counts and percentages.

### `GET /api/leaders`
Returns all leaders sorted by approval.

### `GET /api/elections`
Returns all upcoming elections sorted by date.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#FF6B1A` (Saffron) |
| Secondary | `#138808` (India Green) |
| Accent | `#000080` (Navy) |
| Background | `#05070F` |
| Font: Heading | Rajdhani |
| Font: Body | Hind |
| Font: Display | Bebas Neue |

---

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly vote buttons (min 44px tap targets)
- Native share sheet integration
- Optimized for 3G/4G networks
- CSS animations only (no JS animation libraries on hot path)
- Image formats: AVIF + WebP

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_URL` | ✅ | Vercel Postgres connection string |
| `ADMIN_TOKEN` | ✅ | Admin panel access token |
| `VOTE_SALT` | ✅ | Secret salt for IP hashing |
| `NEXT_PUBLIC_BASE_URL` | Optional | Your domain |

---

## 📄 License

MIT License — Free to use, modify, and deploy.

---

**Made with 🇮🇳 for India** | BharatPolls.in
