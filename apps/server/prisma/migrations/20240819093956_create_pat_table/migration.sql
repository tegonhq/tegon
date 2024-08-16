-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "cron" TEXT;

-- CreateTable
CREATE TABLE "PersonalAccessToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "jwt" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAccessToken_name_userId_token_key" ON "PersonalAccessToken"("name", "userId", "token");
