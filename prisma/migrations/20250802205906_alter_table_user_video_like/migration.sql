/*
  Warnings:

  - You are about to drop the column `status` on the `UserVideoLike` table. All the data in the column will be lost.
  - Added the required column `isLike` to the `UserVideoLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserVideoLike" DROP COLUMN "status",
ADD COLUMN     "isLike" BOOLEAN NOT NULL;
