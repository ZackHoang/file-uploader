/*
  Warnings:

  - You are about to drop the column `folderID` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "folderID",
ADD COLUMN     "parentID" TEXT NOT NULL DEFAULT '.';
