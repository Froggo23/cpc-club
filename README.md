# Competitive Programming Club

Y2K-styled club site: a landing page with an auto-scrolling strip of recent projects, a showcase of every project, and an upload page where students submit a public GitHub repo.

- **Stack:** Next.js 16 (App Router, Cache Components), Supabase (Postgres), Vercel
- **Data:** one table, `projects` — see `supabase/migrations/`. The server reads/writes it with the service-role key; RLS is on with no public policies.
- **Uploads:** `app/actions.ts` validates the link, pulls name/description/language/stars from the GitHub API, and saves it. Set `GITHUB_TOKEN` (optional) to avoid GitHub's 60 req/hr anonymous limit.
- **Removing a project:** delete its row in the Supabase table editor; the site picks it up within a minute.

## Run locally

```bash
cp .env.example .env.local   # fill in Supabase URL + service-role key
npm install
npm run dev
```
