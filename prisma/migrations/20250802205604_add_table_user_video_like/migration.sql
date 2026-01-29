/*
  Warnings:

  - You are about to drop the `_UserDislikedVideos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserLikedVideos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserDislikedVideos" DROP CONSTRAINT "_UserDislikedVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserDislikedVideos" DROP CONSTRAINT "_UserDislikedVideos_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserLikedVideos" DROP CONSTRAINT "_UserLikedVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserLikedVideos" DROP CONSTRAINT "_UserLikedVideos_B_fkey";

-- DropTable
DROP TABLE "public"."_UserDislikedVideos";

-- DropTable
DROP TABLE "public"."_UserLikedVideos";

-- CreateTable
CREATE TABLE "public"."UserVideoLike" (
    "status" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserVideoLike_pkey" PRIMARY KEY ("videoId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVideoLike_videoId_key" ON "public"."UserVideoLike"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVideoLike_userId_key" ON "public"."UserVideoLike"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserVideoLike" ADD CONSTRAINT "UserVideoLike_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserVideoLike" ADD CONSTRAINT "UserVideoLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
