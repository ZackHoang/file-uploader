/*
  Warnings:

  - You are about to drop the column `userID` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[author]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_userID_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "userID",
ADD COLUMN     "author" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_author_key" ON "files"("author");
