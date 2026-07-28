# Setup — Admin Panel + Database + Image Storage

## 1. Install dependencies
```
npm install
```

## 2. Database (Postgres)
Create a free Postgres database — works the same on Vercel or a VPS since
it's just a connection string:
- Neon (neon.tech, free tier, recommended — portable, works everywhere)
- Vercel Postgres (Vercel dashboard → Storage → Create → Postgres)

Copy `.env.example` to `.env` and fill `DATABASE_URL`.

Then push the schema and seed your existing 6 books into the database:
```
npx prisma db push
npm run db:seed
```

## 3. Admin password
In `.env`, set `ADMIN_PASSWORD` to whatever password you want to use to log
into `/admin`.

## 4. Image storage (S3-compatible — Cloudflare R2 recommended)
Images use a standard S3 API, so this works the same on Vercel or a VPS —
no code changes needed if you switch providers later.

**Cloudflare R2 (recommended, generous free tier):**
1. Cloudflare dashboard → R2 → Create bucket (e.g. `coloring-shop`)
2. R2 → Manage API tokens → create a token with read/write access →
   copy the Access Key ID and Secret Access Key
3. Your endpoint is `https://<account-id>.r2.cloudflarestorage.com`
4. In the bucket settings, enable public access to get a `pub-xxxx.r2.dev`
   URL (or attach your own domain) — that's your `S3_PUBLIC_URL`

Fill these in `.env`:
```
S3_ENDPOINT=...
S3_REGION=auto
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=coloring-shop
S3_PUBLIC_URL=...
```

Moving to a VPS later? Point the same env vars at MinIO (self-hosted,
S3-compatible) or AWS S3 — `lib/storage.ts` doesn't change.

## 4b. Order email notifications (SMTP)
Every new order sends you an email automatically. Works with any SMTP
provider — quick options:
- **Gmail**: use an "App Password" (Google Account → Security → App
  Passwords), `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
- **Resend** (resend.com, free tier): `SMTP_HOST=smtp.resend.com`,
  `SMTP_PORT=587`, `SMTP_USER=resend`, `SMTP_PASS=<your Resend API key>`

Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and
`ORDER_NOTIFY_EMAIL` (the address that receives new-order emails) in `.env`.
If left empty, orders still work — the app just skips sending the email
and logs a warning, so checkout is never blocked by missing SMTP config.

## 4c. Update the database for Orders
The schema now includes `Order` and `OrderItem` tables (with `bookId` and
`offerId`), an optional `videoUrl` field on `Book`, a `Promotion` table,
a `SpecialOffer` table, and a `Settings` table (WhatsApp number). Push it
again whenever the schema changes:
```
npx prisma db push
npx prisma generate
```

## 5. Run
```
npm run dev
```
Visit `/admin/login`, enter your password, and you'll land on the dashboard
where you can add/edit/delete books with image upload — no code needed.

## 6. Deploy to Vercel
Push to GitHub, import the repo in Vercel, add the same env vars
(`DATABASE_URL`, `ADMIN_PASSWORD`, `S3_*`), and deploy.
Run `npx prisma db push` once against the production `DATABASE_URL` to
create the table in production (or run it locally pointed at that URL).

## 7. Moving to a VPS later
- Postgres: just update `DATABASE_URL` to your new database (or keep using
  Neon — it works from anywhere).
- Images: point `S3_*` vars at MinIO or another S3-compatible store on your
  VPS, or keep using R2 (it's not tied to Vercel).
- App: `npm run build && npm run start`, or containerize with Docker.
No application code needs to change for the move.
