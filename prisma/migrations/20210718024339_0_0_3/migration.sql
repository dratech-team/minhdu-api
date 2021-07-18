/*
  Warnings:

  - You are about to drop the column `debt` on the `PaymentHistory` table. All the data in the column will be lost.
  - Added the required column `total` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "debt",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paidAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "payType" SET DEFAULT E'CASH';
