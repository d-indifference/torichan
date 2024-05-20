-- DropForeignKey
ALTER TABLE "AttachedFile" DROP CONSTRAINT "AttachedFile_commentId_fkey";

-- AlterTable
ALTER TABLE "AttachedFile" ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AttachedFile" ADD CONSTRAINT "AttachedFile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
