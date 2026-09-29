# DimensionUI — Project Context & AI Memory Handoff

**ATTENTION NEXT AI AGENT:** 
The user has switched chat sessions. Read this file to instantly catch up on the project state, what has been built, and the user's preferences.

## 1. Project Overview
- **Name:** DimensionUI
- **Location:** `C:\Users\91810\WorkBuddy AI\2026-09-16-14-27-27`
- **What it is:** A premium Next.js 15 template marketplace selling 42 copy-paste ready templates (SaaS, B2B, Local Business, etc.).
- **Tech Stack:** Next.js 15 (App Router), Tailwind CSS, Framer Motion, Zustand (for state), Lucide React (icons).

## 2. What We Have Built So Far
- **Core Features:** A responsive gallery with filters (by price tier and industry), a persistent shopping cart (Zustand), coupon code system (`LAUNCH30`, `BUNDLE20`), and a template comparison drawer.
- **Pages:** 
  - `app/page.tsx` (Homepage with bundles, FAQ, and newsletter)
  - `app/template/[id]/page.tsx` (Individual product pages with reviews and 3D mockup previews)
  - `app/blog/page.tsx` (Blog landing)
  - `app/blog/[slug]/page.tsx` (Individual blog posts)
- **Recent SEO Overhaul (Completed):** 
  - Implemented dynamic `sitemap.xml` (48 URLs) and `robots.txt`.
  - Injected `Product` JSON-LD schema into all template pages (including OG image URLs).
  - Injected `Article` JSON-LD schema and canonicals into all blog posts.
  - Added `noindex` layouts for `/login` and `/dashboard`.

## 3. Strict User Preferences (CRITICAL)
- **Terminal Commands:** The user wants you to run terminal commands DIRECTLY. **Never ask for permission** before running a script or terminal command. Just do it.
- **Port:** The Next.js dev server runs on port `4181`. If it's blocked, kill the process on 4181 and restart it.
- **Gallery Edits:** The `gallery.tsx` file is very large. If you need to make changes to it, write a Node.js script to safely parse and replace the content rather than relying on standard regex/replace tools.

## 4. Next Steps
The project is fully production-ready from a code and SEO standpoint. The likely next steps involve:
1. Deploying to Vercel.
2. Integrating a real database (Supabase) as currently it relies on placeholder env variables.
3. PayPal Sandbox checkout integration.
