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
- `/admin` - View all submitted appointment requests

## API Endpoints
- `POST /api/appointments` - Create a new appointment request
- `GET /api/appointments` - List all appointments

## Database Schema
- `appointments` table: id, name, email, phone, service_type, preferred_date, preferred_time, details, created_at

## Recent Changes
- 2026-02-20: Added admin page at /admin to view appointments; added time slot selection (weekdays 6-8pm, weekends 9am-5pm); updated services page with real pricing
- 2026-02-18: Initial build - full website with all pages, navigation, booking form with PostgreSQL persistence