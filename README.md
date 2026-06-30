<div align="center">

# 見 Miru

### Acompanhe tudo que você assiste — filmes, séries, animes e doramas

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

[🇧🇷 Português](#-português) · [🇺🇸 English](#-english)

</div>

---

## 🇧🇷 Português

### O que é o Miru?

**Miru** (見 — "ver/assistir" em japonês) é um rastreador de mídia full-stack inspirado no MyAnimeList, construído do zero. Permite organizar e avaliar tudo que você consome: **filmes, séries, animes e doramas (K-dramas)**, em um só lugar.

> Construí esse projeto para aprofundar minhas habilidades em TypeScript full-stack — projetar uma API REST real, implementar autenticação correta com refresh tokens JWT, integrar APIs externas e construir uma UI polida sem depender de bibliotecas de componentes prontas.

### Funcionalidades

- **Rastreamento de mídia** — adicione títulos à sua lista com status (Assistindo, Concluído, Quero Assistir, Em Pausa, Abandonado) e nota de 1 a 10
- **Quatro categorias** — Filmes, Séries, Animes (via Jikan/MAL) e Doramas (via TMDB)
- **Tendências e descoberta** — seções de trending para cada categoria na página inicial
- **Busca** — pesquise qualquer título em todas as categorias ao mesmo tempo
- **Autenticação completa** — cadastro com email/senha, tokens de acesso JWT (15 min) + refresh tokens (7 dias, armazenados no Redis)
- **Estatísticas** — dados pessoais de consumo por tipo, status e nota média
- **Modo escuro / claro** — detecta preferência do sistema com toggle manual
- **Cache com Redis** — respostas da TMDB e Jikan são cacheadas por 24h para minimizar chamadas externas
- **Layout responsivo** — sidebar recolhível em telas menores

### Stack

#### Frontend (`/web`)

| | |
|---|---|
| **React 18** + **TypeScript** | Framework principal |
| **Vite** | Dev server e bundler |
| **Tailwind CSS v3** | Estilização com tokens de design customizados |
| **TanStack Query v5** | Gerenciamento de estado do servidor, cache e refetch |
| **Zustand v4** | Estado de autenticação no cliente |
| **Framer Motion** | Animações e transições |
| **React Router v6** | Roteamento com rotas protegidas |
| **Lucide React** | Ícones |

#### Backend (`/api`)

| | |
|---|---|
| **Node.js** + **Express** | Servidor HTTP |
| **TypeScript** + **tsx watch** | Tipagem estática com hot reload |
| **Prisma ORM** | Acesso ao banco com tipagem completa |
| **PostgreSQL 16** | Banco de dados principal (via Docker) |
| **Redis** | Store de refresh tokens + cache de respostas de API |
| **bcryptjs** | Hash de senhas |
| **jsonwebtoken** | Assinatura e verificação de JWT |
| **Axios** | Clientes das APIs TMDB e Jikan |
| **Zod** | Validação de requisições |

#### Infraestrutura

| | |
|---|---|
| **Docker Compose** | Containers de PostgreSQL e Redis |
| **TMDB API** | Metadados de filmes, séries e doramas |
| **Jikan API** | Metadados de anime (dados do MyAnimeList, sem chave) |

### Arquitetura

```
miru/
├── api/                    # API REST Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco (User, Entry, MediaCache)
│   └── src/
│       ├── modules/
│       │   ├── auth/       # Registro, login, refresh token
│       │   ├── entries/    # CRUD da lista de acompanhamento
│       │   ├── media/      # Trending, detalhes (providers TMDB + Jikan)
│       │   ├── search/     # Busca entre categorias
│       │   └── users/      # Gerenciamento de perfil
│       ├── middleware/     # Auth JWT, tratamento global de erros
│       ├── lib/            # Cliente Redis
│       └── utils/          # ApiError, asyncHandler, helpers JWT
│
└── web/                    # SPA React + Vite
    └── src/
        ├── api/            # Funções tipadas de acesso à API
        ├── components/     # MediaCard, Sidebar, Navbar, primitivos UI
        ├── pages/          # Home, Busca, Lista, Detalhe, Stats, Auth
        ├── stores/         # Zustand — estado de autenticação
        ├── hooks/          # useAuth, useDebounce
        └── types/          # Tipos TypeScript compartilhados
```

### Fluxo de dados

```
Browser → Vite proxy (/api) → Express API → Prisma → PostgreSQL
                                           ↘ Redis (cache/tokens)
                                           ↘ TMDB API
                                           ↘ Jikan API
```

### Como rodar

#### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- [Chave de API TMDB](https://www.themoviedb.org/settings/api) (gratuita)

#### 1. Clonar e instalar

```bash
git clone https://github.com/CleissonV/miru.git
cd miru

cd api && npm install
cd ../web && npm install
```

#### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e preencha:
- `TMDB_API_KEY` — obtenha gratuitamente em themoviedb.org
- `JWT_SECRET` e `JWT_REFRESH_SECRET` — strings longas e aleatórias

#### 3. Subir infraestrutura

```bash
docker compose up -d
```

Inicia PostgreSQL (porta 5432) e Redis (porta 6379).

#### 4. Rodar migrations

```bash
cd api
npx prisma db push
npx prisma generate
```

#### 5. Iniciar os servidores

```bash
# Terminal 1 — API (porta 3333)
cd api && npm run dev

# Terminal 2 — Web (porta 5173)
cd web && npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) e crie uma conta.

### Decisões técnicas

**Por que construir do zero em vez de usar Next.js/tRPC/etc.?**
Queria visibilidade total em cada camada — roteamento, autenticação, cache e design de API. Usar um meta-framework abstrairia exatamente as partes que queria aprender.

**Por que Jikan para anime em vez de TMDB?**
O Jikan serve dados do MyAnimeList, que tem cobertura de anime muito superior — melhores avaliações da comunidade, contagem de episódios e catalogação. Não requer chave de API.

**Por que tokens de acesso + refresh separados?**
Tokens de curta duração (15 min) limitam o impacto de um token comprometido. Refresh tokens ficam no Redis e podem ser revogados imediatamente no logout — algo impossível com JWTs puramente stateless.

**Por que Redis para cache de API?**
A TMDB limita em 40 req/s. Com cache Redis de 24h, um título popular acessa a API externa apenas uma vez por dia, independente de quantos usuários o buscam.

### Roadmap

- [ ] App mobile (React Native — scaffoldado em `/mobile`)
- [ ] Perfis públicos — compartilhe sua lista
- [ ] Recomendações baseadas no histórico
- [ ] Rastreamento de episódios para séries e animes
- [ ] Importar de MyAnimeList / Trakt

---

## 🇺🇸 English

### What is Miru?

**Miru** (見 — "to watch/see" in Japanese) is a full-stack media tracker inspired by MyAnimeList, built from scratch. It lets you organize and rate everything you consume: **films, TV series, anime, and K-dramas**, in one place.

> I built this to deepen my full-stack TypeScript skills — designing a real REST API, handling auth properly with JWT refresh tokens, integrating external APIs, and building a polished UI without relying on component libraries.

### Features

- **Media tracking** — add titles with status (Watching, Completed, Plan to Watch, On Hold, Dropped) and a 1–10 rating
- **Four categories** — Movies, Series, Anime (via Jikan/MAL), K-Dramas (via TMDB)
- **Trending & discovery** — curated trending rows for each category on the home page
- **Full-text search** — search any title across all categories simultaneously
- **Auth system** — email/password registration, JWT access tokens (15 min) + refresh tokens (7 days in Redis)
- **Statistics page** — personal watch stats by type, status, and average rating
- **Dark / light mode** — system-aware with manual toggle
- **Redis caching** — TMDB and Jikan API responses cached for 24h
- **Responsive layout** — collapsible sidebar navigation

### Tech Stack

**Frontend:** React 18 · TypeScript · Vite · Tailwind CSS v3 · TanStack Query v5 · Zustand · Framer Motion · React Router v6

**Backend:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL 16 · Redis · bcryptjs · jsonwebtoken · Axios · Zod

**Infrastructure:** Docker Compose · TMDB API · Jikan API

### API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, receive tokens |
| POST | `/api/auth/refresh` | — | Rotate refresh token |
| POST | `/api/auth/logout` | ✓ | Revoke refresh token |
| GET | `/api/media/trending` | — | Trending per category |
| GET | `/api/media/:type/:id` | — | Media detail |
| GET | `/api/search?q=&type=` | — | Cross-category search |
| GET | `/api/entries` | ✓ | User's watch list |
| POST | `/api/entries` | ✓ | Add to list |
| PATCH | `/api/entries/:id` | ✓ | Update status/rating |
| DELETE | `/api/entries/:id` | ✓ | Remove from list |
| GET | `/api/entries/stats` | ✓ | Personal statistics |
| GET | `/api/users/me` | ✓ | Own profile |
| PATCH | `/api/users/me` | ✓ | Update profile |

### Getting Started

```bash
git clone https://github.com/CleissonV/miru.git
cd miru

cp .env.example .env   # fill in TMDB_API_KEY and JWT secrets

docker compose up -d   # PostgreSQL + Redis

cd api && npm install && npx prisma db push && npx prisma generate && npm run dev
cd ../web && npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## License

MIT

---

<div align="center">

Desenvolvido por / Built by [Cleisson Vilela](https://github.com/CleissonV)

</div>
