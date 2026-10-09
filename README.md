# StartupForge — Client

**StartupForge** is a startup team builder platform. Founders publish startup ideas, post the roles they need and review applications. Developers, designers, marketers and other professionals browse opportunities and apply to join teams.

- **Live site:** _add your live client link here_
- **Client repository:** <https://github.com/Limonislam5990/startupforge-client>
- **Server repository:** <https://github.com/Limonislam5990/startupforge-server>

## Admin access (for evaluation)

| Email | Password |
|---|---|
| _admin email_ | _admin password_ |

## Tech stack

Next.js (App Router), React, Tailwind CSS, Framer Motion, Better Auth, MongoDB, Stripe Checkout, imgbb for image uploads. Deployed on Vercel.

## Features

**Public**
- Home page with banner, featured startups, featured opportunities and extra sections with animations
- Browse startups and startup details
- Browse opportunities with search (role title, skills), filters (work type, industry) and server-side pagination
- Custom 404 page and loading states

**Authentication**
- Register with name, email, profile image (URL or file upload through imgbb), password and role (Founder or Collaborator)
- Password rules: at least 6 characters, one uppercase and one lowercase letter
- Email and password login, Google login
- Redirect to the intended page after login, otherwise Home
- Sessions survive page reloads and private routes work after refresh
- Blocked users cannot use the dashboard

**Founder dashboard**
- Overview with total opportunities, total applications and accepted members
- Create, update and delete a startup (logo uploaded through imgbb)
- Add, update and delete opportunities
- View applications and accept or reject them
- Premium package through Stripe Checkout after 3 opportunities, with a payment success page

**Collaborator dashboard**
- Apply to opportunities with portfolio link and motivation message
- Track applications and their status
- Update profile (name, image, skills, bio)

**Admin dashboard**
- Platform statistics and charts
- Block and unblock users
- Approve and remove startups
- View transactions

## Security

- Passwords and sessions are handled by Better Auth
- A JWT is issued only to a user with a valid Better Auth session and stored in an HTTPOnly cookie
- All secrets are read from environment variables, nothing sensitive is committed
- Browser requests to the API go through a Next.js rewrite (`/server/...`), so the cookie stays first-party and there are no CORS problems

## Environment variables

Create a `.env` file in the project root. Never commit it.

| Name | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public URL of this app (`http://localhost:3000` locally) |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name, `startupforge` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Secret used to sign the JWT. Must be identical to the server value |
| `SERVER_URL` | URL of the API server (`http://localhost:5000` locally) |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for image uploads |

Add any Stripe related variables your project uses to this table before submitting.

## Run locally

```bash
npm install
npm run dev
```

The app runs on <http://localhost:3000>. Start the server project as well, otherwise API data will not load.

## Deployment notes

- Add all environment variables above in the Vercel project settings
- Set `BETTER_AUTH_URL` to the live client URL
- Add `https://<your-live-domain>/api/auth/callback/google` to the authorized redirect URIs of the Google OAuth client
- Set `SERVER_URL` to the live server URL