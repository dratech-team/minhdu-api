/*
  Warnings:

  - You are about to drop the column `paymentHistoryId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_paymentHistoryId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentHistoryId";

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "orderId" INTEGER;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
