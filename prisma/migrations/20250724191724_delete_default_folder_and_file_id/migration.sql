-- AlterTable
ALTER TABLE "files" ALTER COLUMN "folderID" DROP DEFAULT;

-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "parentID" DROP DEFAULT;
