export interface Poll {
  id: number;
  title: string;
  description: string;
  category: 'election' | 'leader' | 'policy' | 'youth' | 'trending';
  status: 'active' | 'closed' | 'upcoming';
  expires_at: string | null;
  created_at: string;
  total_votes: number;
  trending_score: number;
  options?: PollOption[];
}

export interface PollOption {
  id: number;
  poll_id: number;
  label: string;
  party?: string;
  color: string;
  vote_count: number;
  percentage?: number;
}

export interface Vote {
  id: number;
  poll_id: number;
  option_id: number;
  ip_hash: string;
  fingerprint: string;
  age_group?: string;
  region?: string;
  created_at: string;
}

export interface LeaderStats {
  id: number;
  name: string;
  party: string;
  state: string;
  approval_percent: number;
  disapproval_percent: number;
  neutral_percent: number;
  total_votes: number;
  weekly_rank: number;
  avatar_url?: string;
}

export interface ElectionCountdown {
  id: number;
  name: string;
  state: string;
  election_date: string;
  type: 'assembly' | 'lok_sabha' | 'bypolls';
}

export interface VoteResult {
  success: boolean;
  message: string;
  alreadyVoted?: boolean;
  results?: PollOption[];
}

export interface AdminStats {
  total_polls: number;
  total_votes: number;
  votes_today: number;
  trending_polls: Poll[];
  top_leaders: LeaderStats[];
}
