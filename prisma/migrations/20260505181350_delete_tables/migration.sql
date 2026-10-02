/*
  Warnings:

  - You are about to drop the column `commentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationTypeType` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userEmmiterId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `commentCount` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `metadata` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationTypeType_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userEmmiterId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_videoId_fkey";

-- DropIndex
DROP INDEX "Notification_commentId_key";

-- DropIndex
DROP INDEX "Notification_messageId_key";

-- DropIndex
DROP INDEX "Notification_videoId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "commentId",
DROP COLUMN "messageId",
DROP COLUMN "notificationTypeType",
DROP COLUMN "userEmmiterId",
DROP COLUMN "videoId",
ADD COLUMN     "metadata" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "commentCount";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "NotificationType";
