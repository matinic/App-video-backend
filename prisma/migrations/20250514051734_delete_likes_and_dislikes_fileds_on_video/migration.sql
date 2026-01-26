/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "dislikes",
DROP COLUMN "likes";
