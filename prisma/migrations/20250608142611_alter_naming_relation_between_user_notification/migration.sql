/*
  Warnings:

  - You are about to drop the `_UserNotifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserNotifications" DROP CONSTRAINT "_UserNotifications_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserNotifications" DROP CONSTRAINT "_UserNotifications_B_fkey";

-- DropTable
DROP TABLE "_UserNotifications";

-- CreateTable
CREATE TABLE "_UserNotificationsGet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserNotificationsGet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserNotificationsGet_B_index" ON "_UserNotificationsGet"("B");

-- AddForeignKey
ALTER TABLE "_UserNotificationsGet" ADD CONSTRAINT "_UserNotificationsGet_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserNotificationsGet" ADD CONSTRAINT "_UserNotificationsGet_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
