-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('BASIC', 'ALLOWANCE_STAYED', 'ALLOWANCE', 'OVERTIME', 'ABSENT', 'LATE');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CHIEF_ACCOUNTANT', 'ACCOUNTANT_CASH_FUND', 'ACCOUNTANT_MODERATION', 'SALESMAN', 'SALESMAN_EGG', 'IMPORTER_EXPORTER', 'CONSTRUCTION_DEPARTMENT', 'HUMAN_RESOURCE', 'CAMP_ACCOUNTING', 'CAMP_MANAGEMENT', 'CAMP_DIRECTOR', 'HATCHERY_ACCOUNTING', 'HATCHERY_MANAGEMENT', 'NONE');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "accountId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "workday" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "identify" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avt" TEXT DEFAULT E'https://ibb.co/2ydP38t',
    "gender" "GenderType" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "branchId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "workedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "idCardAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "certificate" TEXT,
    "stayedAt" TIMESTAMP(3),
    "contractAt" TIMESTAMP(3),
    "note" TEXT,
    "qrCode" TEXT,
    "isFlatSalary" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "type" "SalaryType" NOT NULL DEFAULT E'BASIC',
    "datetime" TIMESTAMP(3),
    "times" DOUBLE PRECISION,
    "rate" DOUBLE PRECISION DEFAULT 1,
    "price" DOUBLE PRECISION,
    "forgot" BOOLEAN DEFAULT false,
    "note" TEXT,
    "payrollId" INTEGER,
    "employeeId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "isEdit" BOOLEAN NOT NULL DEFAULT true,
    "confirmedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_unique" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Branch.name_unique" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_accountId_unique" ON "Branch"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Department.name_unique" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department.color_unique" ON "Department"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Position.name_departmentId_unique" ON "Position"("name", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee.id_identify_unique" ON "Employee"("id", "identify");

-- CreateIndex
CREATE UNIQUE INDEX "Salary.title_type_times_rate_price_unique" ON "Salary"("title", "type", "times", "rate", "price");

-- AddForeignKey
ALTER TABLE "Salary" ADD FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
