@echo off
echo Starting Syfe Savings Planner Development Server...
echo.
if not exist .env (
    echo Warning: .env file not found. Please create one with your EXCHANGE_RATE_API_KEY
    echo Example: EXCHANGE_RATE_API_KEY=your_api_key_here
    echo.
)

set NODE_ENV=development
npx tsx server/index.ts