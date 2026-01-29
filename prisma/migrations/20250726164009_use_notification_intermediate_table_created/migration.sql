/*
  Warnings:

  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `_UserNotificationsGet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserNotificationsGet" DROP CONSTRAINT "_UserNotificationsGet_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserNotificationsGet" DROP CONSTRAINT "_UserNotificationsGet_B_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "read";

-- DropTable
DROP TABLE "_UserNotificationsGet";

-- CreateTable
CREATE TABLE "UserNotification" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("userId","notificationId")
);

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
