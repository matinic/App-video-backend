/*
  Warnings:

  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `referenceId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notificationTypeId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[videoId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messageId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notificationTypeId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Notification_referenceId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
DROP COLUMN "referenceId",
DROP COLUMN "type",
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "messageId" TEXT,
ADD COLUMN     "notificationTypeId" TEXT NOT NULL,
ADD COLUMN     "videoId" TEXT;

-- CreateTable
CREATE TABLE "NotificationType" (
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_type_key" ON "NotificationType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_notificationTypeId_key" ON "Notification"("notificationTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_videoId_key" ON "Notification"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_commentId_key" ON "Notification"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_messageId_key" ON "Notification"("messageId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationTypeId_fkey" FOREIGN KEY ("notificationTypeId") REFERENCES "NotificationType"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
