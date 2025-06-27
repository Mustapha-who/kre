-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "HouseOwner" (
    "ownerId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "verificationStatus" BOOLEAN NOT NULL DEFAULT false,
    "totalProperties" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HouseOwner_pkey" PRIMARY KEY ("ownerId")
);

-- CreateTable
CREATE TABLE "House" (
    "houseId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "numberOfBathrooms" INTEGER NOT NULL,
    "furnishingStatus" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "datePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("houseId")
);

-- CreateTable
CREATE TABLE "HouseImage" (
    "imageId" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "houseId" INTEGER NOT NULL,

    CONSTRAINT "HouseImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "Region" (
    "regionId" SERIAL NOT NULL,
    "regionName" TEXT NOT NULL,
    "area" DOUBLE PRECISION,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "street" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("regionId")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "inquiryId" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "responseMessage" TEXT,
    "responseDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "houseId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("inquiryId")
);

-- CreateTable
CREATE TABLE "SavedHouse" (
    "savedId" SERIAL NOT NULL,
    "dateSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "houseId" INTEGER NOT NULL,

    CONSTRAINT "SavedHouse_pkey" PRIMARY KEY ("savedId")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "houseId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HouseOwner_email_key" ON "HouseOwner"("email");

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "HouseOwner"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseImage" ADD CONSTRAINT "HouseImage_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("houseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("houseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "HouseOwner"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedHouse" ADD CONSTRAINT "SavedHouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedHouse" ADD CONSTRAINT "SavedHouse_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("houseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("houseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "HouseOwner"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;
