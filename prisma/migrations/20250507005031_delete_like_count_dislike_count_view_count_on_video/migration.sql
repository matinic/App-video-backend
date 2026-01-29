/*
  Warnings:

  - You are about to drop the column `dislikeCount` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "dislikeCount",
DROP COLUMN "likeCount",
DROP COLUMN "viewCount";

-- CreateIndex
CREATE UNIQUE INDEX "Video_title_key" ON "Video"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");
