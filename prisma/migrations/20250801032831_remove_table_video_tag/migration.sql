/*
  Warnings:

  - You are about to drop the `VideoTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_videoId_fkey";

-- DropTable
DROP TABLE "public"."VideoTag";

-- CreateTable
CREATE TABLE "public"."_TagToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagToVideo_B_index" ON "public"."_TagToVideo"("B");

-- AddForeignKey
ALTER TABLE "public"."_TagToVideo" ADD CONSTRAINT "_TagToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToVideo" ADD CONSTRAINT "_TagToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
