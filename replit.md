# Laura Hahn Schu - Fullstack Developer Portfolio

## Overview
Dynamic fullstack portfolio with CMS, built with Express + Vite + React + PostgreSQL + Drizzle ORM. Features dark/light theme, PT-BR/EN i18n, command palette (Cmd+K), and admin dashboard.

## Architecture
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Framer Motion + Shadcn/UI
- **Backend**: Express.js with session-based admin auth
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (client-side)
- **State**: TanStack React Query
- **Styling**: Tailwind CSS with CSS variables for theming

## Project Structure
```
client/src/
  components/
    navbar.tsx          - Navigation with language/theme toggles
    hero-section.tsx    - Hero with typing effect
    about-section.tsx   - About + experience timeline
    skills-section.tsx  - Skills bento grid + GitHub stats
    projects-section.tsx - Project gallery with filtering
    contact-section.tsx - Contact form with Zod validation
    footer.tsx          - Footer
    command-palette.tsx - Cmd+K global search
    scroll-progress.tsx - Scroll progress bar
    theme-provider.tsx  - Dark/light theme
  pages/
    home.tsx            - Main portfolio page
    project-detail.tsx  - Individual project page
    admin.tsx           - Admin CMS dashboard
    admin-login.tsx     - Admin login
  lib/
    i18n.ts             - Internationalization (PT-BR/EN)
    queryClient.ts      - TanStack Query setup
server/
  db.ts               - Database connection
  storage.ts          - Storage interface (CRUD)
  routes.ts           - API routes
  seed.ts             - Database seed data
shared/
  schema.ts           - Drizzle ORM models (projects, skills, experiences, messages)
```

## Database Models
- **projects**: title, slug, description, content, imageUrl, githubUrl, liveUrl, techStack[], featured
- **skills**: name, category, iconUrl, proficiency
- **experiences**: company, role, startDate, endDate, description, achievements[]
- **messages**: senderName, senderEmail, subject, message, read

## Key Features
- Theme toggle (dark/light) with system preference detection
- Language toggle (PT-BR / EN)
- Command palette (Cmd+K / Ctrl+K)
- Scroll progress indicator
- Admin CMS at /admin (password: admin123)
- Contact form with database storage
- Animated sections with Framer Motion
- Responsive design

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- `npm run db:push` syncs database schema
