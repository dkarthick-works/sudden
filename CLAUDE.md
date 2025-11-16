# CLAUDE.md

This file provides comprehensive guidance for AI assistants (Claude Code and similar tools) when working with this repository.

## Project Overview

**Sudden Trading Journal** - A full-stack web application for tracking stock trades, documenting trading decisions, and analyzing performance metrics. Helps traders learn from their past trades by maintaining detailed historical records of their thought processes.

**Version:** 0.0.1-SNAPSHOT
**Architecture:** Monorepo with separate backend and frontend applications
**Deployment:** Docker Compose orchestration with MongoDB and Redis

---

## Repository Structure

```
sudden/
├── .env.example                          # Environment variables template
├── .gitignore                           # Git ignore rules
├── docker-compose.yml                   # Multi-service orchestration
├── SECURITY.md                          # Secrets management guide
├── README-DOCKER.md                     # Docker deployment guide
├── mongodb-init/                        # Database initialization
│   └── init-mongo.js                   # User creation script
├── sudden/                              # Backend (Spring Boot)
│   ├── Dockerfile                       # Backend container build
│   ├── pom.xml                         # Maven dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/deeka/sudden/
│   │   │   │   ├── SuddenApplication.java         # Main entry point
│   │   │   │   ├── controllers/
│   │   │   │   │   └── JournalController.java    # REST endpoints
│   │   │   │   ├── services/
│   │   │   │   │   └── JournalService.java       # Business logic
│   │   │   │   ├── models/
│   │   │   │   │   ├── TradeEntry.java           # Main entity
│   │   │   │   │   ├── BuyReasonLog.java         # Log record
│   │   │   │   │   ├── ExitPlanLog.java          # Log record
│   │   │   │   │   ├── MistakeLog.java           # Log record
│   │   │   │   │   ├── TakeAwayLog.java          # Log record
│   │   │   │   │   ├── EntryType.java            # Enum
│   │   │   │   │   ├── GenericResponse.java      # API wrapper
│   │   │   │   │   └── APIError.java             # Error model
│   │   │   │   ├── repositories/
│   │   │   │   │   └── TradeEntryRepository.java # Data access
│   │   │   │   └── handlers/
│   │   │   │       └── GlobalExceptionHandler.java
│   │   │   └── resources/
│   │   │       └── application.properties        # Spring config
│   │   └── test/
│   │       └── java/com/deeka/sudden/
│   │           └── SuddenApplicationTests.java
│   └── bruno/                           # API collection for testing
│       └── sudden/
│           ├── collection.bru
│           ├── create-trade-entry.bru
│           └── bruno.json
└── sudden-client/                       # Frontend (React + Vite)
    ├── reference-images/                # UI design references
    │   ├── 01-landing-page.png
    │   ├── 02-add-trade.png
    │   ├── 03-edit-trade-log.png
    │   └── 04-dashboard-view.png
    └── trading-journal/
        ├── Dockerfile                   # Frontend container build
        ├── nginx.conf                   # Nginx configuration
        ├── package.json                 # NPM dependencies
        ├── vite.config.js              # Vite build config
        ├── tsconfig.json               # TypeScript config
        ├── eslint.config.js            # Linting rules
        ├── public/                      # Static assets
        └── src/
            ├── main.tsx                # React entry point
            ├── App.tsx                 # Router setup
            ├── index.css               # Global styles
            ├── pages/
            │   ├── HomePage.tsx        # Dashboard with trade list
            │   └── AddTradePage.tsx    # Create/edit trade form
            ├── components/
            │   ├── TradeRow.tsx        # Table row component
            │   └── LogField.tsx        # Historical log display
            ├── services/
            │   └── api.ts              # Backend API integration
            └── types/
                └── trade.ts            # TypeScript interfaces
```

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.5.6
- **Language:** Java 21
- **Build Tool:** Maven 3.9
- **Database:** MongoDB 7.0
- **Cache:** Redis 7 (Alpine)
- **Libraries:**
  - Spring Data MongoDB
  - Spring Data Redis
  - Spring Web
  - Lombok (code generation)
  - Spring Boot DevTools (development)

### Frontend
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.1.14
- **Routing:** React Router DOM 7.9.3
- **Icons:** Lucide React 0.544.0
- **Web Server:** Nginx (Alpine)
- **Linting:** ESLint 9

### Infrastructure
- **Container Runtime:** Docker
- **Orchestration:** Docker Compose 3.8
- **Reverse Proxy:** Nginx
- **API Testing:** Bruno

---

## Architecture & Design Patterns

### Backend Architecture

**Pattern:** Layered MVC with Repository Pattern

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
MongoDB Database
```

**Key Principles:**
- RESTful API design with versioning (`/api/v1/journal`)
- Stateless services
- Environment-based configuration (no hardcoded values)
- Global exception handling
- Response standardization via `GenericResponse<T>`

**Data Model Design:**
- Append-only log pattern for trade reflections
- Timestamps on all historical entries
- MongoDB documents with embedded arrays for logs
- Immutable log records (Java Records)

### Frontend Architecture

**Pattern:** Component-based with Service Layer

```
React Components
    ↓
API Service Layer
    ↓
Backend REST API
```

**Key Principles:**
- Separation of concerns (components, pages, services, types)
- Type safety with TypeScript interfaces
- Custom hooks for state management
- Proxy-based API routing during development
- Responsive design with Tailwind CSS

**State Management:**
- Local component state with `useState`
- Side effects with `useEffect`
- No global state management (Redux, Context) currently

---

## Development Workflows

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sudden
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with strong passwords (see SECURITY.md)
   ```

3. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify services**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Local Development (Without Docker)

**Backend:**
```bash
cd sudden
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

**Frontend:**
```bash
cd sudden-client/trading-journal
npm install
npm run dev
# Runs on http://localhost:5173 (Vite default)
# Proxies /api to http://localhost:8081
```

### Docker Development

**Start all services:**
```bash
docker-compose up -d --build
```

**View logs:**
```bash
docker-compose logs -f [service-name]
# service-name: mongodb, redis, backend, frontend
```

**Rebuild specific service:**
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

**Stop services:**
```bash
docker-compose stop          # Stop without removing
docker-compose down          # Stop and remove containers
docker-compose down -v       # Stop, remove containers + volumes
```

**Access running containers:**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh -u <user> -p <password> sudden
docker-compose exec redis redis-cli
```

### Testing

**Backend:**
```bash
cd sudden
./mvnw test
```

**Frontend:**
```bash
cd sudden-client/trading-journal
npm run lint
# Note: No test framework configured yet (consider adding Vitest)
```

### API Testing

**Using Bruno:**
1. Open Bruno application
2. Load collection from `sudden/bruno/sudden/`
3. Available requests:
   - Get All Trades
   - Create Trade Entry

**Manual Testing:**
```bash
# Get all trades
curl http://localhost:8082/api/v1/journal

# Create trade
curl -X POST http://localhost:8082/api/v1/journal \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "entryType": "BUY",
    "capital": 10000,
    "buyPrice": 150.50
  }'
```

---

## Key Conventions

### Code Style

**Backend (Java):**
- Use Lombok annotations (`@Getter`, `@Setter`, `@Data`)
- Java Records for immutable DTOs
- Constructor injection for dependencies
- Package naming: `com.deeka.sudden.[layer]`
- REST endpoints: `/api/v1/[resource]`

**Frontend (TypeScript/React):**
- PascalCase for components and types
- camelCase for variables and functions
- Arrow functions for components
- Explicit return types for functions
- Interface over type for object shapes

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `TradeRow.tsx`)
- Services: `camelCase.ts` (e.g., `api.ts`)
- Types: `camelCase.ts` (e.g., `trade.ts`)
- Pages: `PascalCase.tsx` (e.g., `HomePage.tsx`)

**API Endpoints:**
- Format: `/api/v{version}/{resource}`
- Example: `/api/v1/journal`
- Methods: POST (create), GET (read), PUT (update), DELETE (delete)

**Database:**
- Collections: snake_case (e.g., `trade_entries`)
- Fields: camelCase (e.g., `buyPrice`, `sellPrice`)

### Git Workflow

**Branch Strategy:**
- Main branch: `main` (production-ready)
- Feature branches: `claude/[feature-name]-[session-id]`
- Always develop on feature branches
- Create PRs for merging to main

**Commit Messages:**
- Use conventional commits format
- Examples:
  - `feat: add trade filtering by status`
  - `fix: correct P/L calculation for partial positions`
  - `docs: update deployment guide`
  - `refactor: extract log component`

---

## Security Conventions

### Secrets Management

**CRITICAL RULES:**
1. **NEVER** commit `.env` files to Git
2. **NEVER** hardcode credentials in source code
3. **ALWAYS** use environment variables for sensitive data
4. **ALWAYS** use strong passwords (20+ characters)

**Environment Variables:**
- Template: `.env.example` (committed)
- Actual: `.env` (gitignored)
- Production: Docker Secrets or cloud secret managers

**Required Environment Variables:**
```
MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
MONGO_APP_USERNAME
MONGO_APP_PASSWORD
MONGO_DATABASE
REDIS_HOST
REDIS_PORT
SERVER_PORT
FRONTEND_PORT
```

**See:** `SECURITY.md` for complete guide

### API Security

- No authentication currently implemented
- CORS configured via Spring Boot defaults
- MongoDB requires authentication
- Redis accessible only within Docker network

**TODO:** Add authentication/authorization layer

---

## Service Ports

### Docker Deployment (Production-like)
- **Frontend:** http://localhost:3000 (port 80 in container)
- **Backend API:** http://localhost:8082 (port 8081 in container)
- **MongoDB:** localhost:27018 (port 27017 in container)
- **Redis:** localhost:6380 (port 6379 in container)

### Local Development
- **Backend:** http://localhost:8081
- **Frontend (Vite):** http://localhost:5173
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

---

## API Reference

### Base URL
- Development: `http://localhost:8082/api/v1`
- Production: Configured via environment

### Endpoints

**GET /journal**
- Description: Retrieve all trade entries
- Response: `GenericResponse<List<TradeEntry>>`

**GET /journal/{id}**
- Description: Retrieve single trade entry
- Response: `GenericResponse<TradeEntry>`

**POST /journal**
- Description: Create new trade entry
- Body: TradeEntry object (without ID)
- Required fields: `symbol`, `entryType`, `capital`, `buyPrice`
- Response: `GenericResponse<TradeEntry>`

**PUT /journal/{id}**
- Description: Update existing trade entry
- Body: Partial TradeEntry object
- Response: `GenericResponse<TradeEntry>`

### Response Format

**Success:**
```json
{
  "data": { /* entity or list */ },
  "message": "Success message",
  "error": null
}
```

**Error:**
```json
{
  "data": null,
  "message": null,
  "error": {
    "message": "Error description"
  }
}
```

---

## Data Models

### TradeEntry

**MongoDB Collection:** `trade_entries`

**Fields:**
- `id` (String) - Auto-generated
- `symbol` (String) - Stock ticker, required, immutable after creation
- `entryType` (EntryType) - Enum: BUY or SELL, required
- `capital` (BigDecimal) - Capital deployed, required
- `buyPrice` (Float) - Entry price, required
- `sellPrice` (Float) - Exit price, optional (null for open positions)
- `buyReasonLogs` (Array<BuyReasonLog>) - Historical buy reasons
- `exitPlanLogs` (Array<ExitPlanLog>) - Historical exit strategies
- `mistakeLogs` (Array<MistakeLog>) - Trading mistakes
- `takeAwayLogs` (Array<TakeAwayLog>) - Lessons learned

### Log Structure

All log types follow this pattern:
```typescript
{
  timestamp: string (ISO 8601),
  log: string
}
```

**Behavior:**
- Logs are append-only (never deleted or modified)
- Each update adds a new entry with current timestamp
- Frontend displays history chronologically

### Calculated Fields (Frontend)

**Trade Status:**
- `OPEN` - sellPrice is null
- `CLOSED` - sellPrice has value

**Profit/Loss:**
```
P/L Amount = (sellPrice - buyPrice) * (capital / buyPrice)
P/L Percentage = ((sellPrice - buyPrice) / buyPrice) * 100
```

**Quantity:**
```
Quantity = capital / buyPrice
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Define model** (if needed) in `sudden/src/main/java/com/deeka/sudden/models/`
2. **Add repository method** in `TradeEntryRepository.java` (if custom query needed)
3. **Implement service method** in `JournalService.java`
4. **Add controller endpoint** in `JournalController.java`
5. **Update frontend API service** in `sudden-client/trading-journal/src/services/api.ts`
6. **Add TypeScript types** in `sudden-client/trading-journal/src/types/`
7. **Test with Bruno** - add new request to `sudden/bruno/sudden/`

### Adding a New Frontend Page

1. **Create page component** in `sudden-client/trading-journal/src/pages/`
2. **Add route** in `App.tsx`
3. **Create necessary components** in `components/` directory
4. **Add API integration** in `services/api.ts` if needed
5. **Update TypeScript types** in `types/` if needed
6. **Test routing** and ensure navigation works

### Modifying the Data Model

1. **Update MongoDB entity** in `TradeEntry.java`
2. **Update TypeScript interface** in `trade.ts`
3. **Modify API service** to handle new fields
4. **Update UI components** to display/edit new fields
5. **Consider database migration** if changing existing fields

### Adding Environment Variables

1. **Add to `.env.example`** with placeholder value
2. **Add to `docker-compose.yml`** in appropriate service
3. **Update `application.properties`** (backend) or `vite.config.js` (frontend)
4. **Update documentation** in README-DOCKER.md and SECURITY.md
5. **Notify team** to update their local `.env` files

---

## Troubleshooting

### Backend Won't Start

**Check MongoDB connection:**
```bash
docker-compose logs mongodb
docker-compose exec backend sh
# Inside container:
ping mongodb
```

**Verify environment variables:**
```bash
docker-compose config
```

**Check application logs:**
```bash
docker-compose logs backend
```

### Frontend Build Fails

**Clear node_modules and rebuild:**
```bash
cd sudden-client/trading-journal
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Check for TypeScript errors:**
```bash
npm run build
# Review output for type errors
```

### Database Connection Issues

**Verify credentials:**
- Check `.env` file has correct values
- Ensure `init-mongo.js` created the user successfully
- Check MongoDB logs for authentication errors

**Test connection manually:**
```bash
docker-compose exec mongodb mongosh \
  -u <MONGO_APP_USERNAME> \
  -p <MONGO_APP_PASSWORD> \
  --authenticationDatabase sudden \
  sudden
```

### API Proxy Not Working

**In development mode:**
- Ensure backend is running on port 8081
- Check `vite.config.js` proxy configuration
- Verify frontend is making requests to `/api/v1/...`

**In Docker:**
- Check nginx.conf proxy_pass configuration
- Ensure backend service is healthy: `docker-compose ps`
- Check nginx logs: `docker-compose logs frontend`

### Port Conflicts

**Find process using port:**
```bash
lsof -i :8082  # or any port number
```

**Change ports in docker-compose.yml:**
- Modify the left side of port mapping: `"8083:8081"`

---

## Best Practices for AI Assistants

### When Adding Features

1. **Understand the data flow:** Frontend → API Service → Controller → Service → Repository → MongoDB
2. **Maintain consistency:** Follow existing patterns for similar features
3. **Type safety:** Add TypeScript types for new data structures
4. **Error handling:** Use try-catch and return appropriate error responses
5. **Validation:** Add input validation in both frontend and backend
6. **Documentation:** Update this CLAUDE.md file when adding major features

### When Fixing Bugs

1. **Reproduce first:** Understand the exact failure scenario
2. **Check logs:** Review backend logs and browser console
3. **Test thoroughly:** Verify fix doesn't break existing functionality
4. **Update tests:** Add test cases for the bug scenario (if applicable)

### When Refactoring

1. **Small changes:** Make incremental improvements
2. **Test after each change:** Ensure nothing breaks
3. **Keep history:** Preserve existing behavior unless explicitly changing it
4. **Document breaking changes:** Note any API or interface changes

### Code Quality Checklist

- [ ] No hardcoded credentials or secrets
- [ ] Environment variables properly configured
- [ ] TypeScript types defined for new data structures
- [ ] Error handling implemented
- [ ] Consistent naming conventions
- [ ] Code follows existing architectural patterns
- [ ] API endpoints follow REST conventions
- [ ] Changes tested locally (both Docker and non-Docker)
- [ ] No console.log statements in production code
- [ ] Responsive design maintained (if UI changes)

---

## Future Enhancements

**Suggested improvements:**
- [ ] Add unit tests for backend (JUnit + Mockito)
- [ ] Add frontend tests (Vitest + React Testing Library)
- [ ] Implement authentication/authorization
- [ ] Add user management
- [ ] Implement Redis caching for frequently accessed data
- [ ] Add pagination for trade list
- [ ] Add data export functionality (CSV, PDF)
- [ ] Add performance analytics dashboard
- [ ] Implement real-time price updates
- [ ] Add mobile-responsive improvements
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and logging (Prometheus, Grafana)

---

## Additional Resources

- **Security Guide:** `SECURITY.md` - Comprehensive secrets management
- **Docker Guide:** `README-DOCKER.md` - Deployment documentation
- **Legacy CLAUDE.md:** `sudden/CLAUDE.md` - Original feature documentation
- **Reference Designs:** `sudden-client/reference-images/` - UI mockups
- **API Collection:** `sudden/bruno/sudden/` - Bruno API tests

---

## Support & Questions

When working with this codebase:

1. **Read this file first** - Most common questions are answered here
2. **Check existing code** - Look for similar implementations
3. **Review documentation** - SECURITY.md and README-DOCKER.md
4. **Examine reference images** - UI/UX expectations in `reference-images/`
5. **Test changes** - Use Bruno collection or manual testing

**Remember:**
- This is an active development project
- Security is paramount (never commit secrets)
- Maintain code quality and consistency
- Document significant changes
- Test thoroughly before committing

---

**Last Updated:** 2025-11-16
**Claude.ai Code Optimized:** Yes
**Version:** 1.0.0
