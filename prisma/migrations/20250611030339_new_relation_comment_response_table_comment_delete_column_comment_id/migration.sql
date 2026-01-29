/*
  Warnings:

  - You are about to drop the column `commentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- DropIndex
DROP INDEX "Comment_commentId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commentId";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_fkey" FOREIGN KEY ("id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
