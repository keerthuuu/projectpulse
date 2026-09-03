# ProjectPulse: Supabase → Render PostgreSQL Migration

This folder contains your `backend` code rewired to use plain PostgreSQL
(via the `pg` npm package) instead of Supabase. Follow these steps in order.

## What changed

- `src/config/supabase.js` is **no longer used** — replaced by `src/config/db.js`
  (a plain PostgreSQL connection pool).
- `src/config/env.js` now reads `DATABASE_URL` and `JWT_SECRET` instead of the
  three `SUPABASE_*` variables.
- **Authentication no longer uses Supabase Auth.** Since Supabase Auth was a
  separate service (not just the database), login/register are now handled
  with `bcryptjs` (password hashing) + `jsonwebtoken` (session tokens) —
  entirely within your own backend.
- `schema.sql` has one addition: a `password_hash` column on the `users`
  table, and `users.id` now auto-generates a UUID (previously Supabase Auth
  generated it).
- Every controller/service that called `supabase.from('table')...` has been
  rewritten to use SQL queries via `pg`.
- `package.json`: removed `@supabase/supabase-js`, added `pg`, `bcryptjs`,
  `jsonwebtoken`.

## Step 1 — Replace your backend folder

Copy every file in this folder into your `backend/` folder, overwriting the
matching files. You can also just delete your old `backend` folder contents
(except `node_modules`) and copy everything from here in.

**Important:** delete `src/config/supabase.js` — it's no longer imported
anywhere and will just cause confusion if left behind.

## Step 2 — Install the new dependencies

Open Command Prompt in your `backend` folder and run:

```
npm install
```

This removes `@supabase/supabase-js` usage and installs `pg`, `bcryptjs`,
and `jsonwebtoken` (already declared in the updated `package.json`).

## Step 3 — Set up your `.env`

Open `backend/.env` and replace its contents with:

```
PORT=5000
FRONTEND_URL=https://projectpulse-ai.netlify.app
DATABASE_URL=paste-your-render-external-database-url-here
JWT_SECRET=paste-a-long-random-string-here
```

- **DATABASE_URL**: go to your Render dashboard → `projectpulse-db` →
  Connections → copy the **External Database URL**.
- **JWT_SECRET**: any long random string works (e.g. generate one at
  https://www.uuidgenerator.net/ and paste it in, or mash your keyboard for
  40+ characters). This is what signs your login tokens — keep it secret and
  never commit it to GitHub.

## Step 4 — Create your tables on Render

With `DATABASE_URL` set in `.env`, run the schema file against your Render
database using `psql` (the tool you installed earlier):

```
psql "your-render-external-database-url-here" -f schema.sql
```

This creates all 9 tables, indexes, and Row Level Security policies directly
on Render — no need to restore the old Supabase backup dump.

## Step 5 — (Optional) Seed some test data

```
npm run seed
```

This creates 3 test accounts (all with password `password123`), 2 sample
projects, and 2 sample tasks. Useful for testing without setting up
everything by hand.

## Step 6 — Run the backend

```
npm run dev
```

You should see the same startup banner as before
(`🚀 ProjectPulse REST API Backend Server Running`) with no errors.

## Step 7 — Test login

Using the seeded account:

```
POST http://localhost:5000/api/auth/login
Body: { "email": "alex.rivera@projectpulse.io", "password": "password123" }
```

You should get back a real JWT token and user object.

## Notes on frontend

Your `frontend/.env` only points at `VITE_API_URL` (your backend's URL) — it
never talked to Supabase directly. **No frontend code changes are needed.**

## Reminder

Once everything is verified working, reset your Supabase database password
one more time (Connect → Reset database password in the Supabase dashboard)
since it was shared in chat during setup — good practice even though you're
moving off Supabase.
