/*
  Warnings:

  - Added the required column `userName` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'User';
