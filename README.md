# Yellow Book - Business Directory Platform


Yellow-book/
├── apps/
│   ├── web/          # Next.js frontend (port 9002)
│   └── api/          # Express.js backend (port 3001)
├── libs/
│   ├── contract/     # Shared Zod schemas & TypeScript types
│   └── config/       # Shared configuration
└── .github/workflows/    # CI/CD with Nx affected commands
```

- **Frontend**: Next.js 15, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Prisma ORM, SQLite
- **Monorepo**: Nx workspace with affected commands
- **Type Safety**: TypeScript, Zod schemas
- **CI/CD**: GitHub Actions with Nx optimization

**API Endpoints:**
- `GET /api/yellow-books` - List businesses (pagination, search, filters)
- `GET /api/yellow-books/:id` - Business details with reviews
- `GET /api/categories` - Categories list

**Web Pages:**
- `/` - Home with search and categories
- `/yellow-books` - Business listings
- `/business/:id` - Business details
- `/admin` - Admin panel for CRUD operations

**Database:** 5+ seeded businesses with reviews and categories

# Build & Quality
npm run build           
npm run lint             
npm run typecheck        

# Database
npm run prisma:generate  
npm run prisma:migrate   
npm run prisma:seed      

npm run affected:build
npm run affected:lint    

## Database Schema

**YellowBookEntry**: Business info, address, location, contact, hours, rating, images
**Review**: Author, rating, comment, date
**Category**: Name, icon

## Troubleshooting

**Nx TypeScript Processing Issues:**
```bash
# Install required dependencies
npm install --save-dev @swc-node/register @swc/core

# Regenerate Prisma client
npm run prisma:generate
```

**Status Check:**
- npm run lint ✅
- npm run typecheck ✅  
- npm run build ✅

## Author

**Bataa715** - [GitHub](https://github.com/Bataa715) - [Repository](https://github.com/Bataa715/yellow-book-nx)
