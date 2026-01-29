/*
  Warnings:

  - A unique constraint covering the columns `[referenceId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referenceId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "referenceId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_referenceId_key" ON "Notification"("referenceId");
