/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Medicine` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "expiryDate",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL;
