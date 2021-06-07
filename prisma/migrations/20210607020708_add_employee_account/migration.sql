/*
  Warnings:

  - You are about to drop the column `accountId` on the `Branch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_accountId_fkey";

-- DropIndex
DROP INDEX "Branch_accountId_unique";

-- DropIndex
DROP INDEX "Salary.title_type_times_rate_price_unique";

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_accountId_unique" ON "Employee"("accountId");

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
