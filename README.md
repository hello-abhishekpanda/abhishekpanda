# Abhishek Panda

The production source for [abhishekpanda.com](https://www.abhishekpanda.com): a Next.js portfolio, engineering blog archive, and self-contained AI learning library.

## Public routes

- `/` — portfolio home
- `/guide` — learning guide and curriculum hub
- `/blogs` — searchable static blog archive
- `/contact` — contact and social links
- `/learning/*.html` — standalone curriculum chapters and cloud guides

The site has no database, authentication system, cron jobs, or required environment variables.

## Local development

Install Node.js 20.9 or newer and pnpm 11, then run:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Before publishing, verify the same commands Vercel will use:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push this folder to `https://github.com/hello-abhishekpanda/abhishekpanda`.
2. In Vercel, import that GitHub repository.
3. Keep the detected **Next.js** framework preset and repository root (`.`).
4. Keep the default install, build, and output settings. No environment variables are needed.
5. Add `abhishekpanda.com` and `www.abhishekpanda.com` under Project → Settings → Domains.

Vercel will run `pnpm build` and serve the Next.js application. Navigation uses root-relative links, so every page also works when opened or refreshed directly.

## Main content files

- `app/portfolio.tsx` — shared shell, navigation, and home page
- `app/guide-hub.tsx` — guide landing page
- `app/contact-page.tsx` — contact page
- `app/blog-catalog.tsx` and `app/posts.json` — blog archive
- `app/data.ts` — professional history and profile content
- `app/globals.css` — responsive visual system
- `public/learning/` — curriculum and guide pages
- `public/Abhishek-Panda-CV-2026.pdf` — downloadable CV

Update the site in this folder only; generated `.next` output and installed `node_modules` remain ignored by Git.
