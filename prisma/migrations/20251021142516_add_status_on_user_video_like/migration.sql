/*
  Warnings:

  - Added the required column `status` to the `UserVideoLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserVideoLike" ADD COLUMN     "status" BOOLEAN NOT NULL;
