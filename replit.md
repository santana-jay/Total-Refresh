# TotalRefresh Surface Care Website

## Overview
A modern business website for TotalRefresh, an upholstery and carpet cleaning company. Built with React + Express + PostgreSQL.

## Project Architecture
- **Frontend**: React with wouter routing, Tailwind CSS v4, shadcn/ui components, framer-motion
- **Backend**: Express.js with API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Manrope (display) + DM Sans (body)
- **Color scheme**: Deep teal primary (#235C66), clean whites

## Pages
- `/` - Home (hero, problem statement, why extraction, what we clean, CTA)
- `/about` - About the company
- `/services` - Service listings with pricing
- `/contact` - Phone, email, social media
- `/book` - Appointment booking form (connected to database, time selection, 1-week advance minimum)
- `/coming-soon` - Reusable placeholder page (currently used for Facebook link)
- `/superadminmothafucka` - Admin panel with login (username + password), CRUD for appointments

## API Endpoints
- `POST /api/appointments` - Create a new appointment request (public)
- `GET /api/appointments` - List all appointments (auth required)
- `PUT /api/appointments/:id` - Update an appointment (auth required)
- `DELETE /api/appointments/:id` - Delete an appointment (auth required)
- `POST /api/admin/login` - Admin login (username + password)
- `POST /api/admin/change-password` - Change admin password (auth required)
- `POST /api/admin/request-reset` - Request password reset token
- `POST /api/admin/reset-password` - Reset password with token

## Database Schema
- `appointments` table: id, name, email, phone, service_type, preferred_date, preferred_time, details, created_at
- `admin_users` table: id, username, password_hash, reset_token, reset_token_expiry, created_at

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `ADMIN_DEFAULT_PASSWORD` - Password for the default "admin" account created on first startup
- `PORT` - Server port (defaults to 5000)

## Hosting & Platform Dependencies
This project was built on Replit. The following items are platform-specific and would need attention if moving to another host:

### Replit-specific files (safe to remove for non-Replit hosting)
- `.replit` - Replit workspace config (run command, port mapping, deployment settings)
- `vite-plugin-meta-images.ts` - Vite plugin that reads `REPLIT_INTERNAL_APP_DOMAIN` and `REPLIT_DEV_DOMAIN` env vars to set OpenGraph image URLs

### Replit-specific packages in package.json (devDependencies, safe to remove)
- `@replit/vite-plugin-runtime-error-modal` - Shows runtime errors in a browser overlay during dev
- `@replit/vite-plugin-cartographer` - Dev-only mapping plugin (only loaded when `REPL_ID` is set)
- `@replit/vite-plugin-dev-banner` - Dev-only banner (only loaded when `REPL_ID` is set)

### What you need for non-Replit hosting
1. A PostgreSQL database — set `DATABASE_URL` env var with the connection string
2. Set `ADMIN_DEFAULT_PASSWORD` env var before first startup to create the admin account
3. Node.js 20+ runtime
4. Run `npm install`, then `npm run build`, then `npm start` for production
5. In `vite.config.ts`, the Replit plugins are conditionally loaded (only when `REPL_ID` exists), so they are automatically skipped outside Replit

## Recent Changes
- 2026-02-22: Added ComingSoon page for Facebook link; refactored entire codebase with junior-dev-friendly comments; removed @replit comments from UI components; updated twitter:site to @totalrefreshnow; documented Replit dependencies for alternative hosting
- 2026-02-20: Added CRUD to admin panel; login requires username + password; admin path changed to /superadminmothafucka; logo updated to provided brand image
- 2026-02-20: Added admin page with login, change/reset password; time slot selection (weekdays 6-8pm, weekends 9am-5pm); updated services page with real pricing
- 2026-02-18: Initial build - full website with all pages, navigation, booking form with PostgreSQL persistence
