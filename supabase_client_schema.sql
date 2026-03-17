-- ============================================================
-- HAKD CLIENT PORTAL — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- CLIENTS TABLE
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default substring(md5(random()::text), 1, 24),
  created_at timestamptz default now(),

  -- Identity
  name text not null,
  email text,
  age int,
  emm_archetype text,
  emm_score int,
  emm_primary_gap text,

  -- Physical Baseline
  height_cm int,
  weight_kg numeric(5,1),
  body_comp_goal text,
  years_training int,
  training_background text,
  current_weekly_frequency int,
  preferred_session_length int, -- minutes
  equipment_access text, -- 'full_gym' | 'home' | 'both'
  wearable_device text,
  hrv_baseline int,
  vo2max numeric(4,1),

  -- Injury & Limitations
  current_injuries text,
  movement_restrictions text,
  past_surgeries text,
  contraindications text,

  -- Lifestyle & Recovery
  occupation_type text, -- 'desk' | 'physical' | 'variable'
  daily_stress_level int check (daily_stress_level between 1 and 10),
  travel_frequency text, -- 'none' | 'occasional' | 'frequent'
  avg_sleep_hours numeric(3,1),
  sleep_quality int check (sleep_quality between 1 and 10),
  alcohol_frequency text,
  caffeine_habits text,
  nutrition_approach text,
  nutrition_quality int check (nutrition_quality between 1 and 10),

  -- Goals
  primary_goal text,
  secondary_goal text,
  success_vision text,
  past_obstacles text,
  non_negotiables text,

  -- Coaching Preferences
  primary_motivator text,
  communication_style text, -- 'direct' | 'supportive' | 'educational' | 'mixed'
  accountability_preference text, -- 'hard_push' | 'gentle' | 'aware'
  coaching_needs text[], -- array: ['training','mindset','habits','recovery','nutrition']
  biggest_obstacle text,

  -- Commitments (co-created on first call)
  habit_1 text,
  habit_2 text,
  habit_3 text,
  behavior_to_stop text,
  weekly_non_negotiable text,

  -- Status
  active boolean default true
);

-- CHECK-INS TABLE
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  submitted_at timestamptz default now(),
  week_of date not null default date_trunc('week', current_date)::date,

  -- Core 3 questions
  energy_score int check (energy_score between 1 and 10),
  commitment_answer text check (commitment_answer in ('yes', 'mostly', 'struggled')),
  flag_note text,

  -- Optional deeper questions (shown if commitment_answer = 'struggled')
  struggle_reason text,
  support_needed text,

  -- Coach response (filled by Gemini or manually)
  coach_response text,
  response_sent_at timestamptz,
  response_read_at timestamptz
);

-- COACH PERSONALITY TABLE
create table if not exists coach_personality (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  version int default 1,
  personality_document text, -- the full extracted personality profile
  example_messages jsonb,    -- array of {scenario, response} pairs
  active boolean default true
);

-- INDEX for fast token lookups
create index if not exists idx_clients_token on clients(token);
create index if not exists idx_checkins_client_week on check_ins(client_id, week_of);

-- Enable RLS (Row Level Security)
alter table clients enable row level security;
alter table check_ins enable row level security;
alter table coach_personality enable row level security;

-- Allow anonymous reads/writes via token (client-facing)
-- Note: for the coach dashboard, use the service role key server-side
create policy "clients_anon_read" on clients
  for select using (true);

create policy "checkins_anon_insert" on check_ins
  for insert with check (true);

create policy "checkins_anon_read" on check_ins
  for select using (true);

create policy "personality_anon_read" on coach_personality
  for select using (active = true);
