# Yellow Book - Business Directory Platform

A modern, full-stack business directory application built with **Nx monorepo**, **Next.js**, **Express**, **Prisma**, and **TypeScript**.

## 🏗️ Architecture Overview

This project follows a monorepo architecture using **Nx** to manage multiple applications and shared libraries:

```
Yellow-book/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Express.js backend API
├── libs/
│   ├── contract/     # Shared type definitions and Zod schemas
│   └── config/       # Shared configuration utilities
└── .github/
    └── workflows/    # CI/CD pipelines
```

### Design Choices

#### 1. **Nx Monorepo**

- **Why**: Centralized codebase management, efficient CI/CD with affected commands, shared code reuse
- **Benefits**:
  - Only build/test/lint affected projects on changes
  - Consistent tooling across all projects
  - Type-safe imports between apps and libraries

#### 2. **Type-Safe Contract (libs/contract)**

- **Why**: Ensure API and frontend stay in sync
- **Implementation**: Zod schemas that generate TypeScript types
- **Benefits**: Runtime validation + compile-time type safety

#### 3. **Prisma ORM**

- **Why**: Type-safe database access, migrations, easy seeding
- **Database**: SQLite for development (easily switch to PostgreSQL/MySQL in production)
- **Benefits**:
  - Auto-generated TypeScript client
  - Schema-first development
  - Easy data seeding

#### 4. **Express.js API**

- **Why**: Lightweight, flexible, well-established
- **Structure**: Controller-based architecture with route separation
- **Features**: CORS enabled, JSON parsing, error handling middleware

#### 5. **Next.js Web App**

- **Why**: React framework with SSR/SSG, optimal performance
- **Features**: App Router, server components, client-side data fetching
- **Styling**: Tailwind CSS with shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bataa715/Yellow-book.git
   cd Yellow-book
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed the database with sample data (5 businesses)
   npm run prisma:seed
   ```

4. **Start development servers**

   ```bash
   # Start both API and Web concurrently
   npm run dev

   # Or start individually:
   npm run dev:api    # API on http://localhost:3001
   npm run dev:web    # Web on http://localhost:9002
   ```

## 📦 Project Structure

### Apps

#### `apps/api` - Backend API Server

- **Technology**: Express.js + TypeScript
- **Database**: Prisma + SQLite
- **Port**: 3001
- **Endpoints**:
  - `GET /api/yellow-books` - List all businesses (with pagination, search, category filter)
  - `GET /api/yellow-books/:id` - Get single business with reviews
  - `GET /api/categories` - List all categories
  - `GET /health` - Health check

#### `apps/web` - Frontend Application

- **Technology**: Next.js 15 + TypeScript + Tailwind CSS
- **Port**: 9002
- **Pages**:
  - `/` - Home page with search and categories
  - `/yellow-books` - List all businesses
  - `/business/:id` - Business detail page
  - `/search` - Search results

### Libraries

#### `libs/contract` - Shared Type Definitions

- Zod schemas for validation
- TypeScript type exports
- Used by both API and Web for type safety

#### `libs/config` - Shared Configuration

- Environment variable management
- API configuration
- Pagination defaults

## 🛠️ Available Scripts

### Development

```bash
npm run dev           # Start all apps in parallel
npm run dev:api       # Start API server only
npm run dev:web       # Start web app only
```

### Building

```bash
npm run build         # Build all projects
npm run build:api     # Build API only
npm run build:web     # Build web app only
```

### Database

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
```

### Code Quality

```bash
npm run lint          # Lint all projects
npm run typecheck     # Type check all projects
```

### Nx Affected (CI Optimization)

```bash
npm run affected:build  # Build only affected projects
npm run affected:test   # Test only affected projects
npm run affected:lint   # Lint only affected projects
```

## 🧪 Testing the API

### Using curl

```bash
# Get all yellow books
curl http://localhost:3001/api/yellow-books

# Get with pagination
curl "http://localhost:3001/api/yellow-books?limit=10&offset=0"

# Search by category
curl "http://localhost:3001/api/yellow-books?category=Ресторан"

# Get single entry
curl http://localhost:3001/api/yellow-books/1

# Get categories
curl http://localhost:3001/api/categories
```

## 🎨 Features

### Backend Features

- ✅ RESTful API with Express.js
- ✅ Prisma ORM with SQLite
- ✅ Type-safe database queries
- ✅ Pagination support
- ✅ Search and filtering
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Database seeding with 5+ businesses

### Frontend Features

- ✅ Server-side rendering with Next.js
- ✅ Client-side data fetching
- ✅ Responsive design with Tailwind CSS
- ✅ shadcn/ui component library
- ✅ Business listing page
- ✅ Pagination and infinite scroll
- ✅ Category filtering
- ✅ Search functionality

### DevOps Features

- ✅ Nx monorepo setup
- ✅ GitHub Actions CI/CD
- ✅ Nx affected commands for optimization
- ✅ ESLint configuration
- ✅ Prettier code formatting
- ✅ TypeScript strict mode
- ✅ Automated type checking

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** with **Nx affected commands** to optimize CI runs:

1. **On PR/Push**: Only affected projects are linted, type-checked, and built
2. **Nx Cloud Integration Ready**: Can be enabled for distributed task execution
3. **Build Artifacts**: Uploaded for deployment
4. **Database Migrations**: Run automatically in CI

### CI Workflow Steps

1. Checkout code
2. Install dependencies
3. Generate Prisma client
4. Run migrations
5. Lint affected projects
6. Type check affected projects
7. Build affected projects
8. Upload build artifacts

## 📊 Database Schema

### YellowBookEntry

- Business information (name, description, categories)
- Address details (city, district, khoroo)
- Location coordinates (lat, lng)
- Contact information (phone, email, website)
- Operating hours
- Rating and review count
- Images and logo

### Review

- Associated with a business
- Author, rating, comment
- Avatar and date

### Category

- Name and icon
- Predefined categories for business classification

## 🔐 Environment Variables

### API (apps/api/.env)

```env
DATABASE_URL="file:./dev.db"
API_PORT=3001
CORS_ORIGINS="http://localhost:3000,http://localhost:9002"
```

### Web (apps/web/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚢 Deployment

### API Deployment

```bash
npm run build:api
npm run start:api
```

### Web Deployment

```bash
npm run build:web
npm run start:web
```

## 📝 Sample Data

The project includes seed data for **5 businesses**:

1. **Modern Nomads** - Mongolian Restaurant
2. **Ubean Coffee** - Coffee Shop
3. **Мини маркет** - Convenience Store
4. **Хурдан сантехникч** - Plumbing Service (24/7)
5. **Гоо сайхны салон** - Beauty Salon

Plus **8 categories** and **3 reviews** for testing.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run typecheck`
4. Submit a pull request

The CI will automatically run affected tests and checks.

## 📄 License

MIT

## 👤 Author

**Bataa715**

- Repository: [Yellow-book](https://github.com/Bataa715/Yellow-book)
- GitHub: [@Bataa715](https://github.com/Bataa715)

## 🙏 Acknowledgments

- Nx for monorepo management
- Next.js for the frontend framework
- Prisma for type-safe database access
- shadcn/ui for beautiful components

---

**Built with ❤️ using modern web technologies**
