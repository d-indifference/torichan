-- CreateEnum
CREATE TYPE "FileAttachmentMode" AS ENUM ('STRICT', 'OPTIONAL', 'FORBIDDEN');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'MODERATOR');

-- CreateTable
CREATE TABLE "Board" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardSettings" (
    "id" UUID NOT NULL,
    "allowPosting" BOOLEAN NOT NULL DEFAULT true,
    "strictAnonymity" BOOLEAN NOT NULL DEFAULT false,
    "threadFileAttachmentMode" "FileAttachmentMode" NOT NULL DEFAULT 'OPTIONAL',
    "replyFileAttachmentMode" "FileAttachmentMode" NOT NULL DEFAULT 'OPTIONAL',
    "delayAfterThread" INTEGER NOT NULL DEFAULT 30,
    "delayAfterReply" INTEGER NOT NULL DEFAULT 15,
    "minFileSize" INTEGER NOT NULL DEFAULT 1,
    "maxFileSize" INTEGER NOT NULL DEFAULT 19922944,
    "allowMarkdown" BOOLEAN NOT NULL DEFAULT true,
    "maxThreadsOnBoard" INTEGER NOT NULL DEFAULT 100,
    "bumpLimit" INTEGER NOT NULL DEFAULT 250,
    "maxStringFieldSize" INTEGER NOT NULL DEFAULT 100,
    "maxCommentSize" INTEGER NOT NULL DEFAULT 2000,
    "maxThreadLivingTime" INTEGER NOT NULL DEFAULT 86400000,
    "defaultPosterName" VARCHAR(256) NOT NULL DEFAULT 'Anonymous',
    "defaultModeratorName" VARCHAR(256) NOT NULL DEFAULT 'Moderator',
    "enableCaptcha" BOOLEAN NOT NULL DEFAULT false,
    "rules" TEXT NOT NULL,

    CONSTRAINT "BoardSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayNumber" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "ip" VARCHAR(64) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "options" VARCHAR(512),
    "subject" VARCHAR(256),
    "comment" TEXT NOT NULL,
    "password" VARCHAR(8) NOT NULL,
    "lastHit" TIMESTAMP(3),
    "boardId" UUID,
    "attachedFileId" UUID,
    "parentId" UUID,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttachedFile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "path" VARCHAR(512) NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" VARCHAR(128) NOT NULL,
    "thumbnailPath" VARCHAR(512),
    "thumbnailWidth" INTEGER,
    "thumbnailHeight" INTEGER,
    "isImage" BOOLEAN NOT NULL,
    "commentId" UUID,

    CONSTRAINT "AttachedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(256) NOT NULL,
    "encryptedPassword" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(64) NOT NULL,
    "till" TIMESTAMP(3) NOT NULL,
    "reason" VARCHAR(512) NOT NULL,
    "userId" UUID,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AttachedFile_commentId_key" ON "AttachedFile"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BoardSettings" ADD CONSTRAINT "BoardSettings_id_fkey" FOREIGN KEY ("id") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFile" ADD CONSTRAINT "AttachedFile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
