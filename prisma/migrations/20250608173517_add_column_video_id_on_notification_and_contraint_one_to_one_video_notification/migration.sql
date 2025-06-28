/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_videoId_key" ON "Notification"("videoId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
