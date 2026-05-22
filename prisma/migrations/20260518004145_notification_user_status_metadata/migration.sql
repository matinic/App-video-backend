/*
  Warnings:

  - The primary key for the `UserNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userDestinationId` on the `UserNotification` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientUserId` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_userDestinationId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_pkey",
DROP COLUMN "userDestinationId",
ADD COLUMN     "recipientUserId" TEXT NOT NULL,
ADD CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("recipientUserId", "notificationId");

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
