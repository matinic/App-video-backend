/*
  Warnings:

  - You are about to drop the `_Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_Subscription" DROP CONSTRAINT "_Subscription_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_Subscription" DROP CONSTRAINT "_Subscription_B_fkey";

-- DropIndex
DROP INDEX "public"."UserVideoLike_userId_key";

-- DropIndex
DROP INDEX "public"."UserVideoLike_videoId_key";

-- DropTable
DROP TABLE "public"."_Subscription";

-- CreateTable
CREATE TABLE "public"."ChannelSubscribers" (
    "channelId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelSubscribers_pkey" PRIMARY KEY ("channelId","subscriberId")
);

-- AddForeignKey
ALTER TABLE "public"."ChannelSubscribers" ADD CONSTRAINT "ChannelSubscribers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChannelSubscribers" ADD CONSTRAINT "ChannelSubscribers_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
