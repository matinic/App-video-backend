/*
  Warnings:

  - You are about to drop the `ChannelSubscribers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChannelSubscribers" DROP CONSTRAINT "ChannelSubscribers_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelSubscribers" DROP CONSTRAINT "ChannelSubscribers_subscriberId_fkey";

-- DropTable
DROP TABLE "ChannelSubscribers";

-- CreateTable
CREATE TABLE "UserOnFollow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOnFollow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "UserOnFollow" ADD CONSTRAINT "UserOnFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnFollow" ADD CONSTRAINT "UserOnFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
