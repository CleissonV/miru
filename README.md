<div align="center">

# 見 Miru

### Track everything you watch — movies, series, anime & K-dramas

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## What is Miru?

**Miru** (見 — "to watch/see" in Japanese) is a full-stack media tracker inspired by MyAnimeList, built entirely from scratch. It lets you organize and rate everything you consume: **films, TV series, anime, and K-dramas**, in one clean interface.

> I built this project to deepen my full-stack TypeScript skills — designing a real REST API, handling auth properly with JWT refresh tokens, integrating external APIs, and building a polished UI from the ground up without relying on component libraries.

---

## Features

- **Media tracking** — add titles to your list with status (Watching, Completed, Plan to Watch, On Hold, Dropped) and a 1–10 rating
- **Four categories** — Movies, Series, Anime (via Jikan/MAL), K-Dramas (via TMDB)
- **Trending & discovery** — curated trending rows for each category on the home page
- **Full-text search** — search any title across all categories simultaneously
- **Auth system** — email/password registration with JWT access tokens (15 min) + refresh tokens (7 days, stored in Redis)
- **Statistics page** — personal watch stats broken down by type, status, and average rating
- **Dark / light mode** — system-aware with manual toggle
- **Caching layer** — Redis caches TMDB and Jikan API responses (24 h TTL) to minimize external calls
- **Responsive layout** — sidebar nav that collapses gracefully on smaller screens

---

## Tech Stack

### Frontend (`/web`)

| | |
|---|---|
| **React 18** + **TypeScript** | Core framework |
| **Vite** | Dev server + bundler |
| **Tailwind CSS v3** | Utility-first styling with custom design tokens |
| **TanStack Query v5** | Server-state management, caching, background refetching |
| **Zustand v4** | Auth client-state (user, tokens) |
| **Framer Motion** | Page transitions and card animations |
| **React Router v6** | Client-side routing with protected routes |
| **Lucide React** | Icon set |

### Backend (`/api`)

| | |
|---|---|
| **Node.js** + **Express** | HTTP server |
| **TypeScript** + **tsx watch** | Type-safe dev with hot reload |
| **Prisma ORM** | Type-safe database access |
| **PostgreSQL 16** | Primary database (via Docker) |
| **Redis** | JWT refresh token store + API response cache |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT signing and verification |
| **Axios** | TMDB + Jikan API clients |
| **Zod** | Request validation |

### Infrastructure

| | |
|---|---|
| **Docker Compose** | PostgreSQL + Redis containers |
| **TMDB API** | Movie, series, and K-drama metadata |
| **Jikan API** | Anime metadata (MyAnimeList data, no key required) |

---

## Architecture

```
miru/
├── api/                    # Node.js + Express REST API
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (User, Entry, MediaCache)
│   └── src/
│       ├── modules/
│       │   ├── auth/       # Register, login, refresh token
│       │   ├── entries/    # CRUD for watch list entries
│       │   ├── media/      # Trending, detail (TMDB + Jikan providers)
│       │   ├── search/     # Cross-category search
│       │   └── users/      # Profile management
│       ├── middleware/     # JWT auth, global error handler
│       ├── lib/            # Redis client
│       └── utils/          # ApiError, asyncHandler, JWT helpers
│
└── web/                    # React + Vite SPA
    └── src/
        ├── api/            # Typed API client functions
        ├── components/     # MediaCard, Sidebar, Navbar, UI primitives
        ├── pages/          # Home, Search, List, MediaDetail, Stats, Auth
        ├── stores/         # Zustand auth store
        ├── hooks/          # useAuth, useDebounce
        └── types/          # Shared TS types
```

### Data flow

```
Browser → Vite proxy (/api) → Express API → Prisma → PostgreSQL
                                          ↘ Redis (cache/tokens)
                                          ↘ TMDB API
                                          ↘ Jikan API
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### 1. Clone and install

```bash
git clone https://github.com/CleissonV/miru.git
cd miru

# Install API deps
cd api && npm install

# Install web deps
cd ../web && npm install
```

### 2. Configure environment

```bash
# From project root
cp .env.example .env
```

Edit `.env` and fill in:
- `TMDB_API_KEY` — get one free at themoviedb.org
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — use long random strings in production

### 3. Start infrastructure

```bash
# From project root
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 4. Run database migrations

```bash
cd api
npx prisma db push
npx prisma generate
```

### 5. Start the servers

```bash
# Terminal 1 — API (port 3333)
cd api && npm run dev

# Terminal 2 — Web (port 5173)
cd web && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and create an account.

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, receive tokens |
| POST | `/api/auth/refresh` | — | Rotate refresh token |
| POST | `/api/auth/logout` | ✓ | Revoke refresh token |
| GET | `/api/media/trending` | — | Trending movies/series/anime/doramas |
| GET | `/api/media/:type/:id` | — | Media detail |
| GET | `/api/search?q=&type=` | — | Search across categories |
| GET | `/api/entries` | ✓ | Get user's watch list |
| POST | `/api/entries` | ✓ | Add title to list |
| PATCH | `/api/entries/:id` | ✓ | Update status/rating |
| DELETE | `/api/entries/:id` | ✓ | Remove from list |
| GET | `/api/entries/stats` | ✓ | Personal statistics |
| GET | `/api/users/me` | ✓ | Own profile |
| PATCH | `/api/users/me` | ✓ | Update profile |

---

## Design Decisions

**Why build from scratch instead of using Next.js/tRPC/etc.?**
I wanted full visibility into every layer — routing, auth, caching, API design. Using a full-stack meta-framework would abstract away the parts I wanted to learn.

**Why Jikan for anime instead of TMDB?**
Jikan proxies MyAnimeList data, which has far better anime coverage, community ratings, and episode counts than TMDB. No API key required.

**Why separate access + refresh tokens?**
Short-lived access tokens (15 min) limit the blast radius of a stolen token. Refresh tokens are stored in Redis so they can be revoked immediately on logout — something you can't do with stateless JWTs alone.

**Why Redis for API cache?**
TMDB rate-limits at 40 req/s. With Redis caching trending/detail responses for 24 hours, a popular title only hits the external API once per day regardless of how many users request it.

---

## Roadmap

- [ ] Mobile app (React Native — scaffolded in `/mobile`)
- [ ] Public profiles — share your list with others
- [ ] Recommendations based on your history
- [ ] Episode tracking for series and anime
- [ ] Import from MyAnimeList / Trakt

---

## License

MIT

---

<div align="center">

Built by [Cleisson Vilela](https://github.com/CleissonV) · [cleissonsilva1@hotmail.com](mailto:cleissonsilva1@hotmail.com)

</div>
