# FoodCast frontend

The website for the Lagos Food Price Forecast. It has a **public site** (what shoppers see) and a separate **admin site** (at `/admin`).
It only shows data from the backend in `../food-pricing-backend`; nothing is hardcoded. The list of endpoints and data shapes it follows is in `../API_CONTRACT.md`.

**Built with:** Next.js (App Router), TypeScript, Tailwind CSS, Axios and Recharts. Data is loaded with small custom hooks that use `useState` and `useEffect` (no React Query).

## Set up

1. Start the backend first (see `../food-pricing-backend`). It runs on `http://localhost:5000` and already allows requests from `http://localhost:3000`.
2. In this folder:

```bash
npm install
cp .env.example .env.local     # on Windows: copy .env.example .env.local
npm run dev
```

3. Open <http://localhost:3000>.

`.env.local` has one setting:

| Variable | Meaning | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Address of the backend API | `http://localhost:5000/api/v1` |

Other commands: `npm run build` (production build), `npm start` (run the build), `npm run lint`.

## The pages

**Public site** (the navbar links only to these)

| Page | What it shows |
|---|---|
| `/` | Welcome banner, market overview (rising, falling and steady counts), market drivers (dollar rate, fuel, food inflation), biggest expected rises, category links |
| `/commodities` | Every commodity with search, category, direction and sort filters and paging |
| `/commodities/[slug]` | Price now, next month's forecast with range and confidence, the reasons behind it, price history chart, forecast accuracy, a chat with the FoodCast bot, related commodities |
| `/how-it-works` | Short explanation, a "How to read a forecast" guide, live data status and service health |
| `/feedback` | Feedback form |

**Admin site** (not linked anywhere on the public site; open `/admin` by typing it in the browser)

| Page | What it shows |
|---|---|
| `/admin/login` | Email and password sign-in |
| `/admin` | Headline cards (visitors, views, chats, feedback, accuracy) and the latest data refreshes |
| `/admin/analytics` | Daily usage chart and most viewed commodities |
| `/admin/data` | Freshness of each data step, run a refresh (asks to confirm), refresh history |
| `/admin/accuracy` | Forecast error and direction hit rate over time, best and worst commodities |
| `/admin/feedback` | Feedback inbox; change a message's status (asks to confirm) |
| `/admin/commodities` | List of all commodities |

The admin demo login comes from the backend's `.env` (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

## How it talks to the backend

```
page  ->  hook (src/lib/hooks)  ->  API function (src/lib/api)  ->  Axios client  ->  backend
```

- `src/lib/api/client.ts` is the **one Axios instance**. Before each request it adds the right header:
  - visitor requests get `X-Session-Id`, a random id made once per browser and saved in `localStorage` (the backend needs it for chat and analytics);
  - admin requests (anything under `/admin`) get `Authorization: Bearer <token>`.
  If an admin request comes back `401`, the token is cleared and the browser goes to `/admin/login`.
- `src/lib/api/*.ts` has **one function per endpoint**, with a comment naming the endpoint.
- `src/lib/hooks/*.ts` has one small hook per data need. Each returns `{ data, loading, error, refetch }` and is built on `useFetch`.
- Every data section shows a loading skeleton, a friendly empty message, or an error with a "Try again" button (`components/ui/AsyncView.tsx`).
- The admin token lives in `localStorage` (`src/lib/auth.ts`). `src/app/admin/(panel)/layout.tsx` guards every admin page: no token or a token the backend rejects means a redirect to the login page.
- Page views, commodity views and searches are reported to `POST /analytics/events`.

## Folder map

```
src/
  app/
    layout.tsx            fonts, theme, root layout
    (public)/             public pages + navbar/footer layout
    admin/                admin site: login page and (panel)/ for protected pages
  components/
    ui/                   buttons, cards, skeletons, error/empty states, dialogs ...
    charts/               Recharts charts
    commodity/ home/ info/ chat/ admin/ layout/
  lib/
    api/                  Axios client + one function per endpoint
    hooks/                data hooks (useFetch and friends)
    format.ts             naira, percent and date formatting
  types/                  TypeScript types copied from the API contract
```

## Design notes

- Warm off-white background, deep green main colour, amber accent. Light and dark mode (toggle in the navbar and the admin sidebar).
- Price direction is from a shopper's point of view: **rising = red ↑, falling = green ↓, steady = grey →**, always with an arrow and a word.
- Fonts: Bricolage Grotesque (headings and big numbers) and Plus Jakarta Sans (text), loaded with `next/font`.
- Naira is formatted with `Intl.NumberFormat("en-NG")`, for example `₦1,250`.
- The commodity photos come from the backend (`/images/commodities/...`). Most are Creative Commons licensed. The credit data is kept (`/images/commodities/credits.json` on the backend, plus `getImageCredits`, `useImageCredits` and `CreditsList` here) but is not shown on any page at the moment.
