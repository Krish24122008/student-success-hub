-- Student Success Hub: MVP schema (run in Supabase SQL editor)
--
-- AUTH EMAIL SETUP (Google SMTP only)
-- 1. Google Account > Security > turn on 2-Step Verification.
-- 2. Create an App Password (Security > App passwords). Copy the 16 characters.
-- 3. Supabase > Authentication > Emails > SMTP Settings > Enable custom SMTP:
--      Host: smtp.gmail.com   Port: 465 (SSL)   (587 also works with STARTTLS)
--      Username: your Gmail address   Password: the App Password
--      Sender email: the same Gmail address   Sender name: Student Success Hub
-- 4. Authentication > Providers > Email: enable "Confirm email".
-- 5. Authentication > Emails > Confirm signup template: use {{ .Token }} to send a 6-digit code.
-- 6. In the app, verify with supabase.auth.verifyOtp({ email, token, type: 'signup' }).
-- Note: Gmail limits sending to roughly 500 emails per day. Fine for a hackathon.

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, education_level text, state text,
  skills text[] default '{}', career_goal text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz default now()
);

create table study_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null, file_path text not null, file_type text, file_size bigint,
  summary text, created_at timestamptz default now()
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references study_materials on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  questions jsonb not null, created_at timestamptz default now()
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  score int not null, weak_topics text[], created_at timestamptz default now()
);

create table scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null, amount text, education_level text, state text,
  deadline date, source_url text not null, last_verified date,
  verified boolean not null default false
);

create table internships (
  id uuid primary key default gen_random_uuid(),
  title text not null, location text, stipend text, duration text,
  skills text[] default '{}', deadline date, source_url text,
  verified boolean not null default false
);

create table saved_scholarships (
  user_id uuid references auth.users on delete cascade,
  scholarship_id uuid references scholarships on delete cascade,
  primary key (user_id, scholarship_id)
);

create table saved_internships (
  user_id uuid references auth.users on delete cascade,
  internship_id uuid references internships on delete cascade,
  primary key (user_id, internship_id)
);

create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal text not null, steps jsonb not null, created_at timestamptz default now()
);

create table roadmap_progress (
  roadmap_id uuid references roadmaps on delete cascade,
  step_index int not null, done boolean not null default false,
  primary key (roadmap_id, step_index)
);

-- Auto-create a profile after signup
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles (id) values (new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Admin check
create function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

-- Row Level Security
alter table profiles enable row level security;
alter table study_materials enable row level security;
alter table quizzes enable row level security;
alter table quiz_attempts enable row level security;
alter table scholarships enable row level security;
alter table internships enable row level security;
alter table saved_scholarships enable row level security;
alter table saved_internships enable row level security;
alter table roadmaps enable row level security;
alter table roadmap_progress enable row level security;

create policy "own profile" on profiles for select using (id = auth.uid());
create policy "update own profile" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = 'student');
create policy "own materials" on study_materials for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own quizzes" on quizzes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own attempts" on quiz_attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own saved scholarships" on saved_scholarships for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own saved internships" on saved_internships for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own roadmaps" on roadmaps for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own progress" on roadmap_progress for all
  using (exists (select 1 from roadmaps r where r.id = roadmap_id and r.user_id = auth.uid()));
create policy "public verified scholarships" on scholarships for select using (verified or is_admin());
create policy "admin manages scholarships" on scholarships for all using (is_admin()) with check (is_admin());
create policy "public verified internships" on internships for select using (verified or is_admin());
create policy "admin manages internships" on internships for all using (is_admin()) with check (is_admin());

-- Private storage bucket for PDFs: files live at <user_id>/<filename>
insert into storage.buckets (id, name, public) values ('study-materials','study-materials', false);
create policy "own files read" on storage.objects for select
  using (bucket_id = 'study-materials' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own files write" on storage.objects for insert
  with check (bucket_id = 'study-materials' and (storage.foldername(name))[1] = auth.uid()::text);
