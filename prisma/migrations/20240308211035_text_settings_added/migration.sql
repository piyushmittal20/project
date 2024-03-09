/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Dependent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Insurance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dependent" DROP CONSTRAINT "Dependent_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_insuranceId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "mobileNumber",
DROP COLUMN "password",
DROP COLUMN "role";

-- DropTable
DROP TABLE "Dependent";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Insurance";
