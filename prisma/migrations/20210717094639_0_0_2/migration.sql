/*
  Warnings:

  - You are about to drop the column `currency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `debt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payType` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "currency",
DROP COLUMN "debt",
DROP COLUMN "paidAt",
DROP COLUMN "payType",
ADD COLUMN     "paymentHistoryId" INTEGER;

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "paidAt" TIMESTAMP(3),
    "currency" "CurrencyUnit" DEFAULT E'VND',
    "payType" "PaymentType",
    "debt" DOUBLE PRECISION DEFAULT 0,
    "customerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
