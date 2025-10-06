# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 3. Start Development

```bash
# Option A: Start both servers with npm
npm run dev

# Option B: Use the batch file (Windows)
./start-dev.bat

# Option C: Start individually
npm run dev:api    # Terminal 1 - API on :3001
npm run dev:web    # Terminal 2 - Web on :9002
```

### 4. Access the Application

- **Web App**: http://localhost:9002
- **API**: http://localhost:3001
- **Yellow Books Page**: http://localhost:9002/yellow-books

## ✅ Verify Setup

### Test API

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/yellow-books"

# Or visit in browser
# http://localhost:3001/api/yellow-books
```

### Expected Response

```json
{
  "data": [
    {
      "id": "1",
      "name": "Modern Nomads",
      "description": "Монгол үндэстний зоогийн газар...",
      "categories": ["Ресторан", "Монгол хоол"],
      ...
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

## 📋 Available Endpoints

### Yellow Books

- `GET /api/yellow-books` - List all businesses
- `GET /api/yellow-books/:id` - Get business by ID
- `GET /api/categories` - List all categories

### Query Parameters

- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)
- `category` - Filter by category name
- `search` - Search in name and description

### Examples

```bash
# Get first 10 entries
GET /api/yellow-books?limit=10&offset=0

# Filter by category
GET /api/yellow-books?category=Ресторан

# Search
GET /api/yellow-books?search=кофе

# Get single business with reviews
GET /api/yellow-books/1
```

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start all
npm run dev:api          # API only
npm run dev:web          # Web only

# Database
npm run prisma:generate  # Generate client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed data

# Code Quality
npm run lint             # Lint all
npm run typecheck        # Type check all

# Build
npm run build            # Build all
npm run build:api        # API only
npm run build:web        # Web only
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows - Kill process on port
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Issues

```bash
# Reset database
rm apps/api/prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

### Type Errors

```bash
# Regenerate Prisma client
npm run prisma:generate

# Clear Next.js cache
cd apps/web
rm -rf .next
```

## 📚 Next Steps

1. ✅ Explore the yellow books page: http://localhost:9002/yellow-books
2. ✅ Check the API documentation in README.md
3. ✅ Review the architecture in README.md
4. ✅ Start building new features!

## 🔗 Links

- Main README: [README.md](./README.md)
- GitHub Repo: https://github.com/Bataa715/Yellow-book
- API Docs: See [README.md](./README.md#-testing-the-api)
