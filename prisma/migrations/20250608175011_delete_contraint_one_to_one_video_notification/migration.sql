/*
  Warnings:

  - You are about to drop the column `videoId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_videoId_fkey";

-- DropIndex
DROP INDEX "Notification_videoId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "videoId";
