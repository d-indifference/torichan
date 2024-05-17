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
    "attachedFileId" UUID,
    "boardId" UUID,
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

    CONSTRAINT "AttachedFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_attachedFileId_fkey" FOREIGN KEY ("attachedFileId") REFERENCES "AttachedFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
