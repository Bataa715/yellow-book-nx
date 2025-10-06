-- CreateTable
CREATE TABLE "yellow_book_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressDistrict" TEXT NOT NULL,
    "addressKhoroo" TEXT NOT NULL,
    "addressFull" TEXT NOT NULL,
    "locationLat" REAL NOT NULL,
    "locationLng" REAL NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactWebsite" TEXT,
    "hours" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "images" TEXT,
    "logo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "avatar" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "yellow_book_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
