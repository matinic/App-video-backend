/*
  Warnings:

  - You are about to drop the column `notificationTypeAction` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationTypeModel` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `NotificationType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notificationMessageAction` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationMessageModel` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationTypeModel_notificationTypeAction_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notificationTypeAction",
DROP COLUMN "notificationTypeModel",
ADD COLUMN     "notificationMessageAction" TEXT NOT NULL,
ADD COLUMN     "notificationMessageModel" TEXT NOT NULL;

-- DropTable
DROP TABLE "NotificationType";

-- CreateTable
CREATE TABLE "NotificationMessage" (
    "action" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "NotificationMessage_pkey" PRIMARY KEY ("action","model")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationMessageModel_notificationMessageA_fkey" FOREIGN KEY ("notificationMessageModel", "notificationMessageAction") REFERENCES "NotificationMessage"("action", "model") ON DELETE RESTRICT ON UPDATE CASCADE;
