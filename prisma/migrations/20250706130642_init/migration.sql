-- DropForeignKey
ALTER TABLE "SavedHouse" DROP CONSTRAINT "SavedHouse_userId_fkey";

-- AlterTable
ALTER TABLE "SavedHouse" ADD COLUMN     "ownerId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SavedHouse" ADD CONSTRAINT "SavedHouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedHouse" ADD CONSTRAINT "SavedHouse_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "HouseOwner"("ownerId") ON DELETE SET NULL ON UPDATE CASCADE;
