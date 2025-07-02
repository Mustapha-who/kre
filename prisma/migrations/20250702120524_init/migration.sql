/*
  Warnings:

  - Changed the type of `imageUrl` on the `HouseImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HouseImage" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" BYTEA NOT NULL;
