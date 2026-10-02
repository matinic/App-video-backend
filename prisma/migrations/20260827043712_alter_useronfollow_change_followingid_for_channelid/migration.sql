/*
  Warnings:

  - The primary key for the `UserOnFollow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followingId` on the `UserOnFollow` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `UserOnFollow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOnFollow" DROP CONSTRAINT "UserOnFollow_followingId_fkey";

-- AlterTable
ALTER TABLE "UserOnFollow" DROP CONSTRAINT "UserOnFollow_pkey",
DROP COLUMN "followingId",
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD CONSTRAINT "UserOnFollow_pkey" PRIMARY KEY ("followerId", "channelId");

-- AddForeignKey
ALTER TABLE "UserOnFollow" ADD CONSTRAINT "UserOnFollow_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
