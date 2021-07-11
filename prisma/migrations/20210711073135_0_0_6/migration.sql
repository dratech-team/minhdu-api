-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "driver" TEXT,
ADD COLUMN     "garage" TEXT,
ALTER COLUMN "endedAt" DROP NOT NULL,
ALTER COLUMN "employeeId" DROP NOT NULL;
