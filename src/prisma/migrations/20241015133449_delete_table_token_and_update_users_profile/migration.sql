/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `is_online` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `private_key` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `public_key` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'deleted');

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_user_id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "created_at",
DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_online",
DROP COLUMN "private_key",
DROP COLUMN "public_key",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "UserToken";
