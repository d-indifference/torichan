/*
  Warnings:

  - A unique constraint covering the columns `[commentId]` on the table `AttachedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentId` to the `AttachedFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_attachedFileId_fkey";

-- AlterTable
ALTER TABLE "AttachedFile" ADD COLUMN     "commentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AttachedFile_commentId_key" ON "AttachedFile"("commentId");

-- AddForeignKey
ALTER TABLE "AttachedFile" ADD CONSTRAINT "AttachedFile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
