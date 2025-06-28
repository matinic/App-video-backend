/*
  Warnings:

  - You are about to drop the column `notificationMessageAction` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationMessageModel` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `NotificationMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notificationTypeAction` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationTypeModel` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationMessageModel_notificationMessageA_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notificationMessageAction",
DROP COLUMN "notificationMessageModel",
ADD COLUMN     "notificationTypeAction" TEXT NOT NULL,
ADD COLUMN     "notificationTypeModel" TEXT NOT NULL;

-- DropTable
DROP TABLE "NotificationMessage";

-- CreateTable
CREATE TABLE "NotificationType" (
    "action" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("action","type")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationTypeModel_notificationTypeAction_fkey" FOREIGN KEY ("notificationTypeModel", "notificationTypeAction") REFERENCES "NotificationType"("action", "type") ON DELETE RESTRICT ON UPDATE CASCADE;
