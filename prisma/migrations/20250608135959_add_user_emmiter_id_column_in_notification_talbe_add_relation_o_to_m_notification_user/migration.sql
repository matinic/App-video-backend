/*
  Warnings:

  - Added the required column `userEmmiterId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userEmmiterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userEmmiterId_fkey" FOREIGN KEY ("userEmmiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
