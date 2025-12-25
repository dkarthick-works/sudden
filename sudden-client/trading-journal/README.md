# Trading Journal Application

A modern React/TypeScript application for traders to log trades, track performance, and maintain detailed reflections about their trading decisions, mistakes, and learnings.

## Overview

This application helps traders maintain discipline and continuous improvement through structured journaling. Each trade captures not just the numbers (prices, P&L) but also the thought process, strategy, mistakes, and lessons learned.

## Tech Stack

### Core
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Modern, fast build tool and dev server
- **React Router DOM 7.9.3** - Client-side routing

### Styling & UI
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Lucide React 0.544.0** - Icon library
- Custom color theme with gray and blue palette

### Development & Deployment
- **ESLint** - Code linting
- **Docker** - Multi-stage build with Nginx
- **Nginx** - Production web server with API proxy

## Project Structure

```
trading-journal/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── LogField.tsx     # Journal entry field with history
│   │   ├── TradeRow.tsx     # Table row for trade display
│   │   ├── AddTradeModal.tsx # (Unused) Modal version
│   │   └── TradeCard.tsx    # (Unused) Card layout
│   ├── pages/
│   │   ├── HomePage.tsx     # Main dashboard with trades table
│   │   └── AddTradePage.tsx # Create/Edit trade form
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   └── trade.ts         # TypeScript type definitions
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles & Tailwind config
├── public/                  # Static assets
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf              # Nginx production config
├── vite.config.js         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies & scripts
```

## Features

### 1. Trade Management
- Create new trades with comprehensive details
- Edit existing trades
- View all trades in a searchable, filterable table
- Distinguish between open and closed positions

### 2. Journaling System
- **Time-stamped log entries** - Every journal entry is timestamped
- **Four categories:**
  - **Buy Reason** - Why you entered the trade
  - **Exit Plan** - Your exit strategy
  - **Mistakes** - What went wrong
  - **Takeaways** - Lessons learned
- **Append-only logs** - Historical entries are preserved when editing

### 3. Performance Tracking
- Automatic P&L calculation (amount and percentage)
- Position sizing (quantity calculation)
- Visual indicators (green for profit, red for loss)
- Trade status badges (OPEN/CLOSED)

### 4. Filtering & Search
- Search by ticker symbol
- Filter by trade status:
  - All trades
  - Winning trades (profitable)
  - Losing trades (unprofitable)
  - Open trades (no exit yet)

### 5. User Experience
- Loading states with spinners
- Error handling with user-friendly messages
- Empty states with clear CTAs
- Responsive design
- Smooth hover effects and transitions

## Data Model

### Trade Interface

```typescript
interface Trade {
  id: string;
  symbol: string;                      // Stock ticker (e.g., "AAPL")
  entryType: 'BUY' | 'SELL';          // Trade direction
  capital: number;                     // Amount invested
  buyPrice: number;                    // Entry price
  sellPrice: number | null;           // Exit price (null if open)
  buyReasonLogs: LogEntry[] | null;   // Why you entered
  exitPlanLogs: LogEntry[] | null;    // Exit strategy
  mistakeLogs: LogEntry[] | null;     // Mistakes made
  takeAwayLogs: LogEntry[] | null;    // Lessons learned
}

interface LogEntry {
  timestamp: string;                   // ISO date string
  log: string;                        // Log text content
}
```

### Utility Functions
- `getTradeStatus(trade)` - Returns 'OPEN' or 'CLOSED'
- `calculateProfitLoss(trade)` - Calculates P&L in currency
- `calculateProfitLossPercentage(trade)` - Calculates P&L percentage

## Routes

- `/` - Homepage (trades dashboard)
- `/add-trade` - Create new trade
- `/edit-trade/:id` - Edit existing trade

## API Integration

### Backend
The application connects to a Java Spring Boot backend service.

### Endpoints
- `GET /api/v1/journal` - Fetch all trades
- `GET /api/v1/journal/:id` - Fetch single trade by ID
- `POST /api/v1/journal` - Create new trade
- `PUT /api/v1/journal/:id` - Update existing trade

### Configuration
- **Development:** Vite proxy forwards `/api` to `http://localhost:8081`
- **Production:** Nginx proxy forwards `/api` to backend container

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Setup

The application expects a backend API running on `http://localhost:8081` during development.

### Docker Deployment

```bash
# Build Docker image
docker build -t trading-journal .

# Run container
docker run -p 80:80 trading-journal
```

### Production Deployment

The application uses a multi-stage Docker build:

1. **Build Stage:** Compiles TypeScript and bundles assets with Vite
2. **Production Stage:** Serves static files with Nginx

**Features:**
- Nginx proxies API requests to backend
- React Router fallback handling
- Gzip compression enabled
- Aggressive static asset caching (1 year)

## Architecture

### State Management
- Uses React hooks (`useState`, `useEffect`)
- Component-local state (no Redux/Zustand)
- Simple and straightforward for current scope

### Data Flow

**Loading Trades:**
1. HomePage mounts → `useEffect` triggers
2. Call `fetchTrades()` from API service
3. Update state with trades data
4. Apply filters/search
5. Render TradeRow components

**Creating/Editing:**
1. User fills form on AddTradePage
2. Submit → Call `createTrade()` or `updateTrade()`
3. Navigate back to HomePage on success
4. HomePage refetches trades

### Component Hierarchy

```
App
├── HomePage
│   └── TradeRow (multiple)
└── AddTradePage
    └── LogField (multiple)
```

## Configuration Files

### vite.config.js
- React plugin enabled
- Dev server proxy for API calls

### tsconfig.json
- Target: ES2020
- Strict mode enabled
- JSX: react-jsx (new transform)

### nginx.conf
- Serves static files
- Proxies `/api` to backend
- Handles React Router fallback
- Gzip compression and caching

### tailwind.config.js
Custom color palette and design system defined in `index.css` using Tailwind 4.x `@theme` directive.

## Best Practices

### Code Style
- Functional components with hooks
- TypeScript for type safety
- Utility-first CSS with Tailwind
- Clear separation of concerns

### Error Handling
- Custom `ApiError` class
- User-friendly error messages
- Loading and error states in UI

### Performance
- Vite for fast builds and HMR
- Lazy loading potential for routes
- Optimized Docker image with multi-stage build

## Future Enhancements

### Potential Improvements
1. **State Management** - Add React Query or Zustand for larger scale
2. **Form Validation** - Integrate Zod or React Hook Form
3. **Testing** - Add unit and integration tests
4. **Authentication** - User authentication and authorization
5. **Analytics Dashboard** - Overview stats, charts, performance metrics
6. **Mobile Optimization** - Better mobile experience (could leverage unused TradeCard component)
7. **Export** - Export trades to CSV/Excel
8. **Advanced Filters** - Date range, profit range, strategy tags

## Contributing

When contributing to this project:
- Follow existing code style and patterns
- Use TypeScript for type safety
- Write clean, maintainable code
- Test thoroughly before submitting

## License

[Add your license information here]
