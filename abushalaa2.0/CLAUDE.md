# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start dev server on port 8080
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State**: React Query + custom DataContext (localStorage-based)
- **Forms**: React Hook Form + Zod

## Project Architecture

### Data Layer (`src/context/DataContext.tsx`)
All data (currencies, users, sessions) is stored in localStorage. No external database required.

Key storage keys:
- `currency-watch-ly::currencies` - Currency exchange rates
- `currency-watch-ly::accounts` - User accounts (admins + regular users)
- `currency-watch-ly::session` - Current user session ID

The `useDataStore()` hook provides:
- Currency CRUD operations
- Authentication (login/register/logout)
- User role management
- Password reset functionality

### Routing (`src/App.tsx`)
Protected routes redirect to `/login` if unauthenticated. Admins are redirected to `/admin` after login.

Routes:
- `/` - Home (currency table, requires auth)
- `/admin` - Admin dashboard (currency/user management)
- `/login`, `/register`, `/forgot-password` - Auth flows
- `/about`, `/contact` - Info pages (require auth)

### Component Organization
- `src/components/ui/` - shadcn/ui primitives (49 components)
- `src/components/` - App-specific components (Navbar, Footer, CurrencyTable, WhatsAppButton)
- `src/pages/` - Route page components

## Path Aliases

`@/` maps to `src/` (configured in vite.config.ts and tsconfig)

## Arabic/RTL

The app is primarily in Arabic. The Cairo font family is configured in Tailwind. Text content uses Arabic strings throughout.

## Deployment

Static hosting (e.g., Namecheap cPanel). See `guide.md` for deployment steps. Requires `.htaccess` for client-side routing support.

## Default Admin

Email: `Admin@gmail.com` / Password: `Admin123!` - auto-created if no admin exists.
