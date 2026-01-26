/*
  Warnings:

  - You are about to drop the column `notificationTypeName` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `NotificationType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `type` on the `NotificationType` table. All the data in the column will be lost.
  - Added the required column `notificationTypeModel` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `NotificationType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationTypeName_notificationTypeAction_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notificationTypeName",
ADD COLUMN     "notificationTypeModel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationType" DROP CONSTRAINT "NotificationType_pkey",
DROP COLUMN "type",
ADD COLUMN     "model" TEXT NOT NULL,
ADD CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("action", "model");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationTypeModel_notificationTypeAction_fkey" FOREIGN KEY ("notificationTypeModel", "notificationTypeAction") REFERENCES "NotificationType"("action", "model") ON DELETE RESTRICT ON UPDATE CASCADE;
