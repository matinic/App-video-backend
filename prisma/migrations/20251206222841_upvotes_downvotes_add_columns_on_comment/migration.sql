/*
  Warnings:

  - Added the required column `downvotes` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upvotes` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "downvotes" INTEGER NOT NULL,
ADD COLUMN     "upvotes" INTEGER NOT NULL;
