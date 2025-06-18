# Savings Goal Tracker

## Overview

This is a full-stack web application for tracking savings goals built with React (frontend), Express.js (backend), and PostgreSQL (database). The application allows users to create savings goals, track contributions, and view their progress with currency conversion between USD and INR using real-time exchange rates.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **API Design**: RESTful API endpoints
- **Validation**: Zod schemas for request validation
- **Storage**: Configurable storage layer with in-memory implementation

### Data Storage
- **Database**: PostgreSQL 16 (configured but not fully implemented)
- **ORM**: Drizzle ORM for type-safe database interactions
- **Migration Tool**: Drizzle Kit for schema migrations
- **Current Implementation**: In-memory storage (MemStorage class) for development

## Key Components

### Database Schema
- **Users Table**: User authentication (id, username, password)
- **Goals Table**: Savings goals (id, name, target_amount, currency, created_at)
- **Contributions Table**: Goal contributions (id, goal_id, amount, date, created_at)

### API Endpoints
- `GET /api/goals` - Retrieve all goals with contributions
- `GET /api/goals/:id` - Retrieve specific goal
- `POST /api/goals` - Create new goal
- `POST /api/contributions` - Add contribution to goal
- `GET /api/exchange-rate` - Fetch current USD to INR exchange rate
- `GET /api/dashboard` - Dashboard summary data

### Frontend Components
- **Dashboard**: Overview of total savings and progress
- **GoalCard**: Individual goal display with progress tracking
- **AddGoalModal**: Form for creating new savings goals
- **AddContributionModal**: Form for adding contributions
- **UI Components**: Comprehensive set of reusable components from Shadcn/ui

## Data Flow

1. **Goal Creation**: User creates goal → Form validation → API call → Database storage → UI update
2. **Contribution Tracking**: User adds contribution → Validation → Storage → Progress calculation → UI refresh
3. **Exchange Rate**: Periodic fetching from external API → Cache in application state → Display converted amounts
4. **Dashboard Updates**: Real-time calculation of totals and progress from stored data

## External Dependencies

### Third-Party Services
- **Exchange Rate API**: exchangerate-api.com for USD/INR conversion rates
- **Neon Database**: PostgreSQL hosting service (@neondatabase/serverless)

### Key Libraries
- **Frontend**: React, TanStack Query, Radix UI, Tailwind CSS, Zod, React Hook Form
- **Backend**: Express, Drizzle ORM, connect-pg-simple (for sessions)
- **Development**: Vite, TypeScript, ESBuild

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reloading via Vite
- **Production**: Builds static assets and serves via Express
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Build Process
1. Frontend assets built with Vite to `dist/public`
2. Backend compiled with ESBuild to `dist/index.js`
3. Single server serves both API and static files

### Hosting Platform
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Process Management**: npm scripts for development and production

## Changelog
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.