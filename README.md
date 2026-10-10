# Student Success Hub

React + Vite (frontend), Node + Express (backend), Supabase (login, database, file storage), Gemini (AI).

## 1. Supabase (one time)
1. Create a project at supabase.com.
2. SQL Editor: paste and run `supabase/migrations/001_mvp_schema.sql`, then `supabase/seed.sql` (sample scholarships and internships).
3. Login emails go through Google SMTP only. Steps are in the comments at the top of the migration file
   (Gmail App Password, smtp.gmail.com, port 465). Put `{{ .Token }}` in the "Confirm signup" email template.
4. Project Settings > API: copy the Project URL, the anon key and the service_role (secret) key.

## 2. Backend
```
cd backend
copy .env.example .env      (Mac/Linux: cp .env.example .env)
```
Fill `.env`: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (must be the service_role key, NOT anon), GEMINI_API_KEY.
```
npm install
npm run dev
```
On start it prints `[OK] Supabase service_role key detected`. If it prints `[WARNING]`, fix the key.

## 3. Frontend (second terminal)
```
cd frontend
copy .env.example .env      (Mac/Linux: cp .env.example .env)
```
Fill `.env`: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (the anon key). Keep VITE_API_URL=http://localhost:5000
```
npm install
npm run dev
```
Open http://localhost:5173

After editing any `.env`, stop the terminal with Ctrl + C and run `npm run dev` again.
The service_role key and Gemini key live only in `backend/.env`. Never put them in the frontend.
Change the Gemini model in `backend/src/services/gemini.service.js`.

## 4. Courses module (new)
Top 10 courses are built in. No database setup is needed; all course content lives in `frontend/src/data/courses/`.

| Page | URL | Login needed |
|---|---|---|
| All courses + search | `/courses` (try `/courses?q=python`) | No |
| Course details | `/courses/python-programming` | No |
| Study (lessons + quizzes) | `/courses/python-programming/study` | Yes |
| My courses | `/my-courses` | Yes |

* **Search**: type in the search box on Home, Dashboard or Courses. Suggestions open the course (or a lesson) directly; Enter shows all matches.
* **Study / Enroll buttons**: Enroll saves the course to My Courses. Study opens the lessons (and enrols you). Visitors who are not logged in are sent to Login first, then back.
* **Progress** (completed lessons, quiz scores) is saved in the browser per user (`src/services/courseProgress.js`).
* **Banners and backgrounds**: `frontend/public/images/courses/*.svg` (one per course) and `frontend/public/images/backgrounds/*.svg` (home, dashboard, courses, scholarship, internship, roadmap). Replace any file with your own image of the same name, or set `image: 'https://...'` on a course (see `data/courses/index.js`). If a custom URL fails, the built-in banner is shown.
* **Add or edit a course**: copy any file in `data/courses/`, edit it, then import it in `data/courses/index.js`. Lessons use `L(title, minutes, text, [3 key points], ['lang', 'code'])`, quizzes use `Q(question, [4 options], correctIndex)`.

## Student feedback (star rating + comments)
1. Supabase SQL editor: run `supabase/migrations/002_feedback.sql` (after `001_mvp_schema.sql`).
2. Open `/feedback` in the app. Students log in, pick a topic, tap stars, write a comment.
3. Each feedback shows the writer's profile (name, education, state, goal, skills). Click it for `/feedback/<id>` (full feedback and profile).
