-- DropIndex
DROP INDEX "files_name_key";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "parentID" DROP DEFAULT;
