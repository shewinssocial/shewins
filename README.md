# Shewings — Dynamic Landing Website

A public landing site for Shewings (about, activities, events, gallery,
videos, join/enquiry form) plus a protected admin dashboard for managing
events, gallery images, videos, and enquiries — backed by Supabase
(Postgres + Auth) and Cloudinary (image hosting).

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- **Supabase** — database, Row Level Security, and admin authentication
- **Cloudinary** — image uploads for events and gallery
- Deploys to **Vercel**

---

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the contents of **`supabase/schema.sql`** — this
   creates all tables (`events`, `gallery`, `videos`, `enquiries`,
   `site_settings`), Row Level Security policies, and indexes.
3. **Create the one admin account:** Dashboard → Authentication → Users →
   Add User. There is no public sign-up screen — this is the only way an
   admin account gets created, by design.
4. Copy your Project URL and `anon` public key: Dashboard → Project
   Settings → API. You'll put these in `.env.local` (see step 3 below).

### Row Level Security, in short

- Public visitors can only ever read **published** events, and can only
  ever **insert** (never read) enquiries.
- Every write (insert/update/delete) requires an authenticated session —
  i.e. the logged-in admin.
- Full policy definitions are in `supabase/schema.sql`, and are re-run
  safely (idempotent creates) if you need to re-apply them.

## 2. Cloudinary setup

1. Create a free account at [cloudinary.com](https://cloudinary.com) and
   note your **Cloud Name** (Dashboard home page).
2. Create an **unsigned upload preset** scoped to this project: Settings →
   Upload → Upload presets → Add upload preset →
   - Signing Mode: **Unsigned**
   - Folder: `shewings` (optional but recommended, keeps uploads tidy)
3. Deploy the Cloudinary-deletion Edge Function so the admin can delete
   images without ever exposing your Cloudinary API secret to the browser:

   ```bash
   supabase functions deploy delete-cloudinary-asset
   supabase secrets set \
     CLOUDINARY_CLOUD_NAME=your-cloud-name \
     CLOUDINARY_API_KEY=your-api-key \
     CLOUDINARY_API_SECRET=your-api-secret
   ```

   (API key/secret are on the same Cloudinary dashboard page as the cloud
   name.) This function verifies the caller has a valid Supabase session
   before deleting anything.

## 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in the four `VITE_`-prefixed values (Supabase URL/anon key,
Cloudinary cloud name/upload preset). **Never** put the Cloudinary API
secret in this file or in a `VITE_` variable — it only belongs in the
Supabase Function secret set above.

## 4. Local development

```bash
npm install
npm run dev
```

Public site: `http://localhost:5173`
Admin dashboard: `http://localhost:5173/admin` (sign in with the account
you created in Supabase step 3)

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## 5. Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Framework preset: **Vite**.
3. Add the same four `VITE_...` environment variables from `.env.local`
   in Vercel's Project Settings → Environment Variables.
4. `vercel.json` (included) rewrites all routes to `index.html`, so
   client-side routes like `/admin/events` work correctly on refresh and
   direct link — this is required for a single-page app on Vercel.

---

## Project structure

```
src/
  components/
    public/     — navbar, hero, about, events, gallery, videos, join, footer…
    admin/      — sidebar layout, modal, image uploader, protected route
    ui/         — shared design primitives (buttons, section headings, skeletons)
  pages/
    Home.jsx
    admin/      — Dashboard, EventsManager, GalleryManager, VideosManager, EnquiriesManager, AdminLogin
  data/
    api.js      — all Supabase reads/writes, with camelCase <-> snake_case mapping
  lib/
    supabaseClient.js
    cloudinary.js — unsigned upload + calls the delete Edge Function
  context/
    AuthContext.jsx — Supabase Auth session state
  hooks/
    useReveal.js — scroll-reveal animation hook
supabase/
  schema.sql             — tables + RLS policies
  functions/
    delete-cloudinary-asset/  — Edge Function holding the Cloudinary secret
```

## Notes on scope

Per the project brief, this build intentionally does **not** include any
marketplace, shopping, payment, or service-booking functionality — only
the public content site and the CMS-style admin tools for events, gallery,
videos, and enquiries. The data layer (`src/data/api.js`) is the one
place that talks to Supabase, so adding those features later means
extending this layer rather than rewriting the app.

## A note on typography

The brief asked for FoxType's typefaces. FoxType (foxtype.net) is a paid
type foundry — its fonts aren't free to self-host, and I don't have a way
to purchase or license a font file from this environment. I used
**Fraunces** (display/headings) and **Inter** (body) from Google Fonts
instead, chosen to sit in the same elegant-serif-plus-clean-sans register.

If you purchase a FoxType license, swapping it in takes two steps:

1. Add the licensed font files to `public/fonts/` and an `@font-face`
   block at the top of `src/index.css`.
2. In `tailwind.config.js`, change the `display` (and/or `body`) entry
   under `theme.extend.fontFamily` to your new font's family name.

No component code references "Fraunces" or "Inter" directly — every
heading and body element goes through the `font-display` / `font-body`
Tailwind classes, so this is a two-file change.
