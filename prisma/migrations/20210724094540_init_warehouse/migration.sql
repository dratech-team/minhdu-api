-- CreateEnum
CREATE TYPE "MedicineUnit" AS ENUM ('VIEN', 'LO', 'LIT', 'KG', 'BI');

-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "provider" TEXT,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "invoice" TEXT,
    "unit" "MedicineUnit" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
