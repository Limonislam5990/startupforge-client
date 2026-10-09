# StartupForge — Client

StartupForge is a startup team builder. Founders publish a startup and post the roles they need. Developers, designers, marketers and other professionals browse the opportunities and apply. Admins keep the platform in order.

This repository is the **client** (Next.js). The Express API lives in the server repository: <https://github.com/Limonislam5990/startupforge-server>

- **Live site:** _add your live link here_
- **Server repository:** <https://github.com/Limonislam5990/startupforge-server>

## Features

**Public**
- Home page with banner, latest startups and opportunities (loaded from the API), "Why join" and highlights sections, Framer Motion animation
- Browse Startups with name search, industry filter and server-side pagination
- Startup Details with the startup's open roles
- Browse Opportunities with search by role title or skill (`$regex`), filters by work type and industry (`$in`) and server-side pagination
- Opportunity Details with an apply form
- Login and Register (Better Auth, email and password, Google login, image upload with imgbb, role selection)

**Founder dashboard**
- Overview: total opportunities, total applications, accepted members, application charts
- My Startup: create, update and delete (logo uploaded with imgbb)
- Add Opportunity and Manage Opportunities (view, update, delete)
- Applications: read the full application, accept or reject
- Premium package with Stripe Checkout after 3 free opportunities, payment success page

**Collaborator dashboard**
- Overview with status chart
- Browse opportunities, view details and apply
- My Applications with live status
- Profile: name, image, skills, bio

**Admin dashboard**
- Overview: total users, startups, opportunities, revenue and charts
- Manage Users: block and unblock
- Manage Startups: approve and remove
- Transactions: user, amount, date, payment status

**General**
- Fully responsive layout, responsive dashboard sidebar
- Loading states, custom 404 page, global error page, toast messages
- Private routes protected twice: `proxy.js` checks the session cookie and `app/dashboard/layout.jsx` checks the real session and blocked users

## Tech stack

Next.js (App Router), React, Tailwind CSS, Better Auth with the MongoDB adapter, Framer Motion, Recharts, Lucide icons, react-hot-toast, jsonwebtoken, imgbb for images, Stripe Checkout (server side).

## How authentication works

1. Better Auth handles register, login (email and Google) and the session on the client app.
2. After login, `components/TokenSync.jsx` calls `GET /api/token`. That route checks the Better Auth session and signs a **JWT** with `JWT_SECRET`, stored in an **HTTPOnly cookie** named `token`.
3. The browser calls the Express API through `/server/...`. `next.config.mjs` rewrites those calls to `SERVER_URL`, so the cookie stays first-party and there are no CORS problems.
4. The Express `verifyToken` middleware verifies the cookie and loads the user from the database, so blocked users and role changes take effect right away. Dashboard APIs are protected by role.
5. On logout the `token` cookie is deleted.

`JWT_SECRET` must be the **same value** in the client and the server.

## Environment variables

Create a `.env` file in the project root. Never commit it.

| Name | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public URL of this client (`http://localhost:3000` locally) |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (defaults to `startupforge`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Secret used to sign the JWT (same as the server) |
| `SERVER_URL` | URL of the Express server (`http://localhost:5000` locally) |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for image uploads |

## Run locally

```bash
npm install
npm run dev
```

Start the server too (see the server README), then open <http://localhost:3000>.

Google login needs this authorized redirect URI in Google Cloud Console:
`http://localhost:3000/api/auth/callback/google` (and the same path on your live domain).

## Admin account

Register a normal account, then in the **server** project run:

```bash
npm run make-admin -- your-email@example.com
```

Log in again and the Admin dashboard appears. Admin credentials for review: _add them in the submission form_.

## Deployment (Vercel)

1. Import this repository and add every variable from the table above. `BETTER_AUTH_URL` and the Google redirect URI must use the live domain, and `SERVER_URL` must be the deployed server URL.
2. On the server project set `CLIENT_URL` to the live client URL.
3. After deploying, reload `/dashboard`, `/opportunities` and a details page while logged in. They should all work.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
