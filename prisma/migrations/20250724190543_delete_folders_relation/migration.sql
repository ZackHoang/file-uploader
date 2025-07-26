/*
  Warnings:

  - You are about to drop the column `userID` on the `folders` table. All the data in the column will be lost.
  - Added the required column `author` to the `folders` table without a default value. This is not possible if the table is not empty.
  - Made the column `parentID` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_userID_fkey";

-- DropIndex
DROP INDEX "folders_parentID_key";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "userID",
ADD COLUMN     "author" TEXT NOT NULL,
ALTER COLUMN "parentID" SET NOT NULL,
ALTER COLUMN "parentID" SET DEFAULT '.';
