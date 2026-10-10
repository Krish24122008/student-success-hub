-- Student feedback with star rating (run in Supabase SQL editor AFTER 001_mvp_schema.sql)
--
-- * One feedback per student per topic (category). Sending again updates it.
-- * Everyone can read feedback. Only the student can edit or delete their own (admin can delete any).
-- * The public view shows only safe profile fields (name, education, state, goal, skills). Never email.

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  rating int not null check (rating between 1 and 5),
  category text not null default 'General'
    check (category in ('General','Courses','Study Assistant','Scholarships','Internships','Career Roadmap','Quizzes','Notes')),
  comment text not null check (char_length(btrim(comment)) between 5 and 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);
create index if not exists feedback_created_idx on feedback (created_at desc);
create index if not exists feedback_rating_idx on feedback (rating);

alter table feedback enable row level security;
create policy "read own feedback rows" on feedback for select using (user_id = auth.uid() or is_admin());
create policy "add own feedback" on feedback for insert with check (user_id = auth.uid());
create policy "edit own feedback" on feedback for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own feedback" on feedback for delete using (user_id = auth.uid() or is_admin());

-- Public list: feedback + the writer's profile (safe fields only)
create or replace view feedback_public as
select f.id, f.user_id, f.rating, f.category, f.comment, f.created_at, f.updated_at,
       p.full_name, p.education_level, p.state, p.career_goal, p.skills,
       p.created_at as member_since,
       (f.user_id = auth.uid()) as is_mine
from feedback f left join profiles p on p.id = f.user_id;

-- Rating summary for the top of the feedback page
create or replace view feedback_stats as
select count(*)::int as total,
       coalesce(round(avg(rating), 1), 0)::float as avg,
       (count(*) filter (where rating = 5))::int as five,
       (count(*) filter (where rating = 4))::int as four,
       (count(*) filter (where rating = 3))::int as three,
       (count(*) filter (where rating = 2))::int as two,
       (count(*) filter (where rating = 1))::int as one
from feedback;

grant select on feedback_public, feedback_stats to anon, authenticated;
