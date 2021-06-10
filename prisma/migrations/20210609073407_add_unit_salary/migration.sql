/*
  Warnings:

  - The values [ALLOWANCE_STAYED,LATE] on the enum `SalaryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `payrollId` on the `Salary` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UnitEnum" AS ENUM ('HOUR', 'DAY');

-- AlterEnum
BEGIN;
CREATE TYPE "SalaryType_new" AS ENUM ('BASIC', 'STAY', 'ALLOWANCE', 'OVERTIME', 'ABSENT');
ALTER TABLE "Salary" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Salary" ALTER COLUMN "type" TYPE "SalaryType_new" USING ("type"::text::"SalaryType_new");
ALTER TYPE "SalaryType" RENAME TO "SalaryType_old";
ALTER TYPE "SalaryType_new" RENAME TO "SalaryType";
DROP TYPE "SalaryType_old";
ALTER TABLE "Salary" ALTER COLUMN "type" SET DEFAULT 'BASIC';
COMMIT;

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_payrollId_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "payrollId",
ADD COLUMN     "unit" "UnitEnum" NOT NULL DEFAULT E'DAY';

-- CreateTable
CREATE TABLE "_PayrollToSalary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PayrollToSalary_AB_unique" ON "_PayrollToSalary"("A", "B");

-- CreateIndex
CREATE INDEX "_PayrollToSalary_B_index" ON "_PayrollToSalary"("B");

-- AddForeignKey
ALTER TABLE "_PayrollToSalary" ADD FOREIGN KEY ("A") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollToSalary" ADD FOREIGN KEY ("B") REFERENCES "Salary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
