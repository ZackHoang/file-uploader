/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `folders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentID]` on the table `folders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentID` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_folderID_fkey";

-- DropIndex
DROP INDEX "folders_uuid_key";

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "parentID" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folders_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "folders_parentID_key" ON "folders"("parentID");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_id_fkey" FOREIGN KEY ("id") REFERENCES "folders"("parentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folderID_fkey" FOREIGN KEY ("folderID") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
