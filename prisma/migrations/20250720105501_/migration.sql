/*
  Warnings:

  - You are about to drop the column `name` on the `HouseOwner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HouseOwner" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';
