/*
  Warnings:

  - You are about to drop the `UserVideoLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserVideoLike" DROP CONSTRAINT "UserVideoLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserVideoLike" DROP CONSTRAINT "UserVideoLike_videoId_fkey";

-- DropTable
DROP TABLE "public"."UserVideoLike";

-- CreateTable
CREATE TABLE "UserVideoStatus" (
    "isLike" BOOLEAN NOT NULL,
    "videoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVideoStatus_pkey" PRIMARY KEY ("videoId","userId")
);

-- AddForeignKey
ALTER TABLE "UserVideoStatus" ADD CONSTRAINT "UserVideoStatus_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoStatus" ADD CONSTRAINT "UserVideoStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
