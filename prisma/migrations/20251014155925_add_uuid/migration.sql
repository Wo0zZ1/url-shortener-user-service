/*
  Warnings:

  - You are about to drop the `user_auth` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."user_auth" DROP CONSTRAINT "user_auth_baseUserId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "uuid" TEXT;

-- DropTable
DROP TABLE "public"."user_auth";

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");
