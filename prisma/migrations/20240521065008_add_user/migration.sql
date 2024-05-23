-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'MODERATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(256) NOT NULL,
    "encryptedPassword" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
