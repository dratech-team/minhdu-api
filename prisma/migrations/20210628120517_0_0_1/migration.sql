/*
  Warnings:

  - Added the required column `positionId` to the `OvertimeTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OvertimeTemplate" ADD COLUMN     "positionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OvertimeTemplate" ADD FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
