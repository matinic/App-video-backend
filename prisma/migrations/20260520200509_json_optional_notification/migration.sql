/*
  Warnings:

  - You are about to drop the `UserNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_recipientUserId_fkey";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "metadata" DROP NOT NULL;

-- DropTable
DROP TABLE "UserNotification";

-- CreateTable
CREATE TABLE "UserOnNotification" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "recipientUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOnNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOnNotification" ADD CONSTRAINT "UserOnNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnNotification" ADD CONSTRAINT "UserOnNotification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
