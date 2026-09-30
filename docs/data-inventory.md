# DimensionUI — Data Collection & Processing Inventory

This document provides a comprehensive inventory of all personal, financial, session, and operational data collected or processed within the DimensionUI platform. It is based strictly on the active codebase implementation and production configuration.

---

## 1. Summary of Data Elements

| Data Element | Origin / Entry Point | Purpose | Storage Location | Processors / Third Parties | Retention / Deletion |
|---|---|---|---|---|---|
| **User Email Address** | Magic link login form (`app/login/page.tsx`) or Google OAuth profile | User authentication, vault identification, transaction receipts, purchase linking | Supabase `auth.users` table | Supabase Auth, Google OAuth (if selected) | Retained for lifetime of customer account. Deleted upon customer request. |
| **User Identity Profile** | Google OAuth callback (`/auth/callback`) | Displaying user name/avatar in dashboard and auth state | Supabase `auth.users` metadata | Google Identity Services, Supabase | Synchronized on sign-in; deleted upon account deletion request. |
| **Authentication Session Tokens** | Supabase `@supabase/ssr` client | Session continuity across Server Components, API routes, and browser | HTTP-only Cookies (`sb-*-auth-token`) | Supabase, Browser | Ephemeral JWT session tokens; refreshed automatically; cleared on sign-out. |
| **Order & Transaction Records** | PayPal Checkout capture (`/api/checkout/capture-order`) | Recording verified template purchase, generating license key, purchase history | Supabase `purchases` table (`user_id`, `template_id`, `order_id`, `amount`, `status`, `created_at`) | Supabase, PayPal | Retained indefinitely to verify ongoing commercial license validity. |
| **Commercial License Keys** | Server generated (`lib/paypal.ts:generateLicenseKey`) | Proving legitimate commercial template ownership | Supabase `purchases.license_key`, customer vault UI | DimensionUI Server, Supabase | Retained indefinitely; revoked if a refund is processed. |
| **Template Source Downloads** | Download endpoint (`/api/download/[id]`) | Delivering verified .zip packages to licensed buyers | DimensionUI Server, in-memory ZIP streaming | DimensionUI / Vercel Edge Runtime | Not stored as permanent customer records; stream generated on verified demand. |
| **Shopping Cart State** | Cart drawer additions (`components/cart-drawer.tsx`, `lib/store.ts`) | Maintaining items in cart across page reloads | Browser `localStorage` (`cart-storage`) | None (Client-side only) | Cleared manually by user or automatically upon cart checkout. |
| **Template Idea Requests** | Custom request modal (`components/template-request-modal.tsx`) | Gathering customer interest for new template releases | Browser `localStorage` (`dimensionui_template_requests`) | None (Client-side demo storage) | Retained until browser storage is cleared. |
| **Waitlist / Newsletter Email** | Newsletter banner (`components/newsletter-capture.tsx`) | Collecting emails for early access notification | Browser `localStorage` (`dimensionui_waitlist_email`) | None (Client-side demo storage) | Retained until browser storage is cleared. |
| **Template Browsing History** | Gallery navigation (`components/recently-viewed.tsx`) | Displaying recently viewed items to visitor | Browser `localStorage` (`recently_viewed_templates`) | None (Client-side only) | Automatically pruned (last 6 items); cleared on cache reset. |
| **Customer Reviews** | Template review form (`components/reviews.tsx`) | Storing visitor feedback on specific templates | Browser `localStorage` (`reviews_<templateId>`) | None (Client-side only) | Retained in local browser until cleared. |
| **AI Recommender Queries** | Search query input (`components/ai-recommender.tsx`) | Matching keywords against catalog templates | In-memory component state (`React.useState`) | None (Executed 100% client-side; zero external AI API transmission) | Discarded upon page refresh or modal close. |

---

## 2. Payment & Financial Data Handling

- **Credit/Debit Card Data:** **Never Collected or Stored.** All payment processing, card collection, fraud validation, and transaction clearing are handled exclusively by **PayPal** (PayPal Sandbox during testing/evaluation and PayPal Live in production).
- **Payment Verification Tokens:** Our server only receives and verifies the PayPal `orderId` and capture status code via server-to-server TLS calls (`https://api-m.sandbox.paypal.com/v2/checkout/orders`).

---

## 3. Third-Party Integrations & Data Flow

1. **Supabase (`omsemuafxutottzwiwcd.supabase.co`)**:
   - Manages authentication users, email magic links, and the relational `purchases` table.
   - Protected by Row-Level Security (RLS) policies.
2. **PayPal Sandbox / Live (`api-m.sandbox.paypal.com` / `api-m.paypal.com`)**:
   - Receives server-side requests to create orders and capture payments.
   - Zero sensitive credentials or card numbers pass through DimensionUI servers.
3. **Google Identity (`accounts.google.com`)**:
   - Used exclusively for optional user-initiated Google OAuth sign-in.
   - Passes verified email and public profile tokens back to Supabase.
4. **Vercel**:
   - Hosts application compute and static assets. Server logs may record standard HTTP request metadata (IP address, User-Agent, request timestamp) for security and operational monitoring.

---

## 4. Deletion & Data Retention Policies

- **Sign-Out:** Terminated immediately client-side and server-side via `supabase.auth.signOut()`.
- **Customer Data Export & Deletion:** Because license validity for digital templates must be preserved for existing commercial websites built by customers, account deletion requests are processed manually via `support@dimensionui.com`.
