# Syfe Savings Planner

A modern, responsive savings goal tracker with multi-currency support and live exchange rates. Built with React, TypeScript, and Express.js.

## Features

- 🎯 **Goal Management**: Create and track multiple savings goals
- 💱 **Multi-Currency Support**: Support for USD and INR currencies
- 📊 **Live Exchange Rates**: Real-time USD to INR conversion via ExchangeRate-API
- 📈 **Progress Tracking**: Visual progress bars and percentage completion
- 💰 **Contribution Tracking**: Add dated contributions to your goals
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Clean design with Syfe brand colors

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** for styling
- **Shadcn/UI** components built on Radix UI
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **Node.js 20**
- **Drizzle ORM** for type-safe database interactions
- **In-memory storage** for development
- **Zod** for request validation

### External Services
- **ExchangeRate-API** for live USD/INR exchange rates

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd savings-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXCHANGE_RATE_API_KEY=your_api_key_here
   ```

   Get your free API key from [ExchangeRate-API](https://app.exchangerate-api.com/sign-up)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and validation
└── components.json        # Shadcn UI configuration
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## API Endpoints

### Goals
- `GET /api/goals` - Get all goals with contributions
- `GET /api/goals/:id` - Get specific goal
- `POST /api/goals` - Create new goal

### Contributions
- `POST /api/contributions` - Add contribution to goal

### Exchange Rates
- `GET /api/exchange-rate` - Get current USD to INR rate
- `GET /api/dashboard` - Get dashboard summary data

## Core Requirements Implementation

✅ **Goals Creation**: Add goals with name, target amount, and currency (INR/USD)
✅ **Goals Display**: Cards showing name, target, converted amounts, saved amount, and progress
✅ **Live Exchange Rate**: Fetches latest INR ↔ USD rate from ExchangeRate-API
✅ **Dashboard Totals**: Shows total target, total saved, and overall progress
✅ **Interaction & UX**: Refresh rates button, form validation, loading states
✅ **Responsive Layout**: Works on all screen sizes
✅ **Code Quality**: TypeScript, clear component structure, meaningful commits

## Development Decisions

### Architecture Choices
- **Full-stack TypeScript**: Ensures type safety across frontend and backend
- **In-memory storage**: Simplifies development setup, easily replaceable with database
- **Modular components**: Each component has a single responsibility
- **Shared schema**: Types and validation schemas shared between client and server

### UI/UX Decisions
- **Gradient primary colors**: Matches Syfe brand identity from reference image
- **Progress visualization**: Clear progress bars and percentage indicators
- **Modal-based forms**: Clean, focused user experience for adding goals/contributions
- **Currency conversion display**: Shows both original and converted amounts
- **Responsive grid**: Adapts from single column on mobile to 3 columns on desktop

### Technical Decisions
- **TanStack Query**: Handles caching, background updates, and optimistic updates
- **Zod validation**: Ensures data integrity on both client and server
- **Tailwind CSS**: Rapid development with consistent design system
- **Vite**: Fast development experience with HMR

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.