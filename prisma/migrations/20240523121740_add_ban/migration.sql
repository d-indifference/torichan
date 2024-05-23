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

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
