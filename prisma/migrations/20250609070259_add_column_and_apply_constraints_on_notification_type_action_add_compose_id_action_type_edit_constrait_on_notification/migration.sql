/*
  Warnings:

  - You are about to drop the column `notificationTypeId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `notificationTypeAction` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationTypeName` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `NotificationType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationTypeId_fkey";

-- DropIndex
DROP INDEX "Notification_notificationTypeId_key";

-- DropIndex
DROP INDEX "NotificationType_type_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notificationTypeId",
ADD COLUMN     "notificationTypeAction" TEXT NOT NULL,
ADD COLUMN     "notificationTypeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationType" ADD COLUMN     "action" TEXT NOT NULL,
ADD CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("action", "type");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationTypeName_notificationTypeAction_fkey" FOREIGN KEY ("notificationTypeName", "notificationTypeAction") REFERENCES "NotificationType"("action", "type") ON DELETE RESTRICT ON UPDATE CASCADE;
