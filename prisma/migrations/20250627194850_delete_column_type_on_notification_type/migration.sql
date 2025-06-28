/*
  Warnings:

  - You are about to drop the column `notificationTypeAction` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationTypeModel` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `NotificationType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `action` on the `NotificationType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `NotificationType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notificationTypeType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationTypeModel_notificationTypeAction_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notificationTypeAction",
DROP COLUMN "notificationTypeModel",
ADD COLUMN     "notificationTypeType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationType" DROP CONSTRAINT "NotificationType_pkey",
DROP COLUMN "action";

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_type_key" ON "NotificationType"("type");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationTypeType_fkey" FOREIGN KEY ("notificationTypeType") REFERENCES "NotificationType"("type") ON DELETE RESTRICT ON UPDATE CASCADE;
