/*
  Warnings:

  - Made the column `payrollId` on table `Salary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Salary" ALTER COLUMN "employeeId" DROP NOT NULL,
ALTER COLUMN "payrollId" SET NOT NULL;
