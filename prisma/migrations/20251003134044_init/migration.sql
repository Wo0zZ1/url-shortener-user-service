-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('Admin', 'User', 'Guest');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "type" "user_type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "created_links" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_type_idx" ON "users"("type");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_baseUserId_key" ON "user_auth"("baseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_login_key" ON "user_auth"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_baseUserId_key" ON "user_profiles"("baseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_baseUserId_key" ON "user_stats"("baseUserId");

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
