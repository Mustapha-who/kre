/*
  Warnings:

  - Added the required column `phoneNumber` to the `HouseOwner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HouseOwner" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
