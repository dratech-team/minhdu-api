/*
  Warnings:

  - You are about to drop the column `profileId` on the `Relative` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `Relative` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Relative" DROP CONSTRAINT "Relative_profileId_fkey";

-- DropIndex
DROP INDEX "Relative_profileId_unique";

-- AlterTable
ALTER TABLE "Relative" DROP COLUMN "profileId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Relative" ADD FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
