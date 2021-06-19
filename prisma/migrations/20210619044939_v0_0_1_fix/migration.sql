/*
  Warnings:

  - You are about to drop the column `identity` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identify]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salaryHistoryId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identify` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile.identity_unique";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "email" TEXT,
ADD COLUMN     "salaryHistoryId" INTEGER;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "identity",
ADD COLUMN     "identify" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Relative" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "salaryHistoryId" INTEGER;

-- CreateTable
CREATE TABLE "SalaryHistory" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_unique" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_employeeId_unique" ON "Account"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile.identify_unique" ON "Profile"("identify");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_salaryHistoryId_unique" ON "Employee"("salaryHistoryId");

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("salaryHistoryId") REFERENCES "SalaryHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD FOREIGN KEY ("salaryHistoryId") REFERENCES "SalaryHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
