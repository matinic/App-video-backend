/*
  Warnings:

  - The primary key for the `UserNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserNotification` table. All the data in the column will be lost.
  - Added the required column `userDestinationId` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_userId_fkey";

-- AlterTable
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userDestinationId" TEXT NOT NULL,
ADD CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("userDestinationId", "notificationId");

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_userDestinationId_fkey" FOREIGN KEY ("userDestinationId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
