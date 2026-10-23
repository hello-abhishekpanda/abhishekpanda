# Abhishek Panda — Enterprise AI Solution Architect

The source for [abhishekpanda.com](https://www.abhishekpanda.com): a responsive portfolio, engineering blog, and visual learning library for AI, Azure, and AWS architecture.

## What’s included

- Professional portfolio, career timeline, client context, and downloadable CV
- Searchable engineering blog archive and contact page
- AI/ML curriculum plus standalone Azure and AWS service guides
- Responsive Guide navigation with Azure and AWS dropdown links
- A persistent light/dark theme shared by the portfolio and learning pages
- SEO metadata, Open Graph image, sitemap, robots file, and web manifest

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio and professional experience |
| `/blogs` | Engineering blog archive |
| `/contact` | Contact information and social links |
| `/guide` | Redirect to the AI Solution Architect curriculum |
| `/learning/index.html` | Technology-guides home |
| `/learning/ai-solution-architect-curriculum.html` | AI/ML curriculum |
| `/learning/dotnet-solution-architect.html` | C# 14, .NET 10, Azure, and AI architecture curriculum |
| `/learning/azure-services.html` | Azure services and .NET learning path |
| `/learning/aws-services.html` | AWS services and .NET learning path |

## Run locally

Requirements: Node.js 20.9+ and pnpm 11+.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

Run these checks before pushing changes:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Preview the production build locally with:

```bash
pnpm start
```

## Deploy on Vercel

This project is configured for Vercel’s **Next.js** preset. No environment variables, database, or additional build configuration are required.

1. Import `hello-abhishekpanda/abhishekpanda` into Vercel, or keep the existing linked project.
2. Use repository root `.` and the default detected settings.
3. Confirm `main` is the Production Branch under **Settings → Environments → Production**.
4. Push to `main`; Vercel creates a production deployment automatically.
5. Add `abhishekpanda.com` and `www.abhishekpanda.com` under **Settings → Domains**.

To manually deploy a specific Git revision, open **Deployments → Create Deployment**, enter the `main` branch or a commit SHA, and select **Create Deployment**.

## Main project files

- `app/portfolio.tsx` — portfolio shell, navigation, theme switcher, and career timeline
- `app/data.ts` — professional history and portfolio data
- `app/globals.css` — responsive layout, theme, navigation, and visual styles
- `app/blog-catalog.tsx` and `app/posts.json` — blog archive
- `app/contact-page.tsx` — contact page
- `app/layout.tsx` — shared metadata and early theme initialization
- `public/learning/` — curriculum and standalone service-guide pages
- `public/AbhishekPanda_CV.pdf` — downloadable CV

Generated `.next` output and installed dependencies are intentionally excluded from Git.
