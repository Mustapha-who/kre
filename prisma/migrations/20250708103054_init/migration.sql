/*
  Warnings:

  - You are about to drop the column `verificationStatus` on the `HouseOwner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "House" ADD COLUMN     "verificationStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "HouseOwner" DROP COLUMN "verificationStatus";
