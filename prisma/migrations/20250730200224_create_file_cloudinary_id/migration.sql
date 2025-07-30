/*
  Warnings:

  - A unique constraint covering the columns `[cloudinaryID]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudinaryID` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "cloudinaryID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_cloudinaryID_key" ON "files"("cloudinaryID");
