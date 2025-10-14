# Yellow Book - Бизнесийн Лавлагаа Web

###  1. Nx Monorepo Бүтэц
Yellow-book/
├── apps/
│   ├── web/          # Next.js frontend (port 9002)
│   └── api/          # Express.js backend (port 3001)
├── libs/
│   ├── contract/     # Zod схем болон TypeScript төрөл
│   └── config/       
└── .github/workflows/    # CI/CD with Nx affected commands

###  2. YellowBookEntrySchema Зod Схем
**Байршил:** `libs/contract/src/schemas.ts`
- **YellowBookEntrySchema**: Бизнесийн мэдээлэл, хаяг, байршил, холбоо барих, цаг, үнэлгээ
- **LocationSchema**: Газарзүйн координат (lat, lng)
- **AddressSchema**: Хот, дүүрэг, хороо, бүтэн хаяг
- **ContactSchema**: Утас, имэйл, вэбсайт
- **ReviewSchema**: Сэтгэгдэл, үнэлгээ, огноо
- **CategorySchema**: Ангилал нэр, дүрс тэмдэг

### 3. Prisma Модел + Migration + Seed
**Databse:** SQLite
- **YellowBookEntry**: 5+ бизнес бүртгэгдсэн
- **Category**: ангилал (ресторан, эмнэлэг, салон г.м)
- **Review**: Сэтгэгдэл 

###  4. API Endpoints
- `GET /api/yellow-books` - Бизнес жагсаалт (хайлт, шүүлтүүр)
- `GET /api/yellow-books/:id` - Бизнесийн дэлгэрэнгүй + сэтгэгдэл
- `GET /api/categories` - Ангиллын жагсаалт
- `POST /api/categories` - Ангилал нэмэх
- `PUT /api/categories/:id` - Ангилал засах
- `DELETE /api/categories/:id` - Ангилал устгах

###  5. Next.js Вэб Хуудас
- **Нүүр хуудас** (`/`): Хайлт, ангилал grid
- **Бизнес жагсаалт** (`/yellow-books`): Бүх бизнес
- **Бизнесийн дэлгэрэнгүй** (`/business/:id`): Мэдээлэл + сэтгэгдэл
- **Хайлтын үр дүн** (`/search`): Хайлтын илэрц
- **Админ панел** (`/admin`): CRUD үйлдлүүд

###  6. ESLint + Prettier + TypeScript
- **ESLint**: Кодын чанар шалгах 
- **Prettier**: Кодын хэлбэржүүлэг 
- **TypeScript**: Төрөл шалгах (`tsc --noEmit`) 

###  7. CI/CD GitHub Actions
**Файл:** `.github/workflows/ci.yml`
- **Nx affected**: Зөвхөн өөрчлөгдсөн хэсгүүдийг build хийх
- **Matrix build**: Node.js 20.x
- **Шалгах үйлдлүүд**: lint, typecheck, build, test

## Технологийн Стек
- **Frontend**: Next.js 15, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Prisma ORM, SQLite
- **Monorepo**: Nx workspace with affected commands  
- **Type Safety**: TypeScript, Zod schemas
- **CI/CD**: GitHub Actions with Nx optimization

## Онцлог Функцууд
###  Хайлт Систем
- **Нэрээр хайх**: Бизнесийн нэрээр хайх
- **Байршлаар хайх**: Хот, дүүрэг, хороогоор хайх
- **Ангиллаар шүүх**: Категори сонгож шүүх
- **Хослуулсан хайлт**: Олон критерийг нэгэн зэрэг
###  Responsive Design
- Mobile-first дизайн
- Tailwind CSS ашиглан хариуцагч загвар
- shadcn/ui компонентууд

###  Админ Удирдлага
- Ангилал нэмэх/засах/устгах
- Confirmation dialog
- Toast мэдэгдэл

## Хэрэглэх Заавар
bash
# Суулгах
npm install
# Хөгжүүлэх орчин эхлүүлэх
npm run dev
# Backend API эхлүүлэх (порт 3001)
npm run dev:api
# Frontend эхлүүлэх (порт 9002) 
npm run dev:web

## Командууд
###  Build & Quality
```bash
npm run build           # Бүх апп build хийх
npm run lint            # ESLint шалгах  
npm run typecheck       # TypeScript шалгах
```
###  Өгөгдлийн сан
```bash
npm run prisma:generate # Prisma client үүсгэх
npm run prisma:migrate  # Migration ажиллуулах
npm run prisma:seed     # Анхны өгөгдөл оруулах
```
###  Nx Affected Commands
```bash
npm run affected:build  # Өөрчлөгдсөн хэсгийг build
npm run affected:lint   # Өөрчлөгдсөн хэсгийг lint
npm run affected:test   # Өөрчлөгдсөн хэсгийг test
```
## Өгөгдлийн Сангийн Схем
### YellowBookEntry (Бизнесийн Мэдээлэл)
- `id`, `name`, `description` - Үндсэн мэдээлэл
- `address` - Хот, дүүрэг, хороо, бүтэн хаяг
- `location` - GPS координат (lat, lng)
- `contact` - Утас, имэйл, вэбсайт
- `hours` - Ажиллах цаг
- `rating`, `reviewCount` - Үнэлгээ, сэтгэгдлийн тоо
- `images` - Зургуудын жагсаалт
### Review (Сэтгэгдэл)
- `author` - Зохиогч
- `rating` - Үнэлгээ (1-5)
- `comment` - Сэтгэгдэл
- `date` - Огноо
### Category (Ангилал)  
- `name` - Нэр
- `icon` - Дүрс тэмдэг
## Хэрэгжүүлсэн Функциональности Тухай
###  Бүрэн хэрэгжүүлсэн
1. **Nx Monorepo**: `apps/web`, `apps/api`, `libs/contract`, `libs/config` 
2. **YellowBookEntrySchema**: API болон Web-д ашиглагдаж байна 
3. **Prisma + Migration**: Модел үүсгэгдсэн, 5+ бизнес seed хийгдсэн 
4. **API Endpoints**: `/yellow-books` жагсаалт, Next.js-д харуулагдаж байна 
5. **ESLint + Prettier + TypeScript**: Бүгд ажиллаж байна 
6. **CI/CD**: GitHub Actions, Nx affected commands 

### Нэмэлт Онцлогууд
- **Хайлт систем**: Нэр, байршил, ангиллаар хайх 
- **Админ панел**: Ангилал CRUD үйлдлүүд   
- **Responsive дизайн**: Mobile/Desktop 
- **Review систем**: Сэтгэгдэл, үнэлгээ 
- **Category grid**: Нүүр хуудсанд динамик ангилал 

## Архитектурын Сонголтууд
###  Monorepo Structure
- **Nx workspace**: Affected commands ашиглан performance сайжруулах
- **Shared libs**: `contract` дээр Zod схем хуваалцах
- **Type safety**: Frontend-Backend хоорондын type consistency

###  Database Design  
- **SQLite**: Хөгжүүлэх орчинд хялбар, production-д PostgreSQL-рүү шилжих боломжтой
- **Prisma ORM**: Type-safe database queries, migration удирдлага
- **Seeding**: Анхны өгөгдөл автоматаар оруулах

###  Frontend Architecture
- **Next.js 15**: App Router, Server Components
- **shadcn/ui**: Consistent design system
- **Tailwind CSS**: Utility-first styling

### 🔧 Troubleshooting

**Nx TypeScript Processing Issues:**
```bash
npm install --save-dev @swc-node/register @swc/core
npm run prisma:generate
```
## Холбоосууд
- **Repository**: [GitHub - yellow-book-nx](https://github.com/Bataa715/yellow-book-nx)
- **Author**: [Bataa715](https://github.com/Bataa715)
