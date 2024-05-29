/*
  Warnings:

  - You are about to drop the column `userId` on the `Riwayat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Riwayat" DROP CONSTRAINT "Riwayat_userId_fkey";

-- AlterTable
ALTER TABLE "Riwayat" DROP COLUMN "userId";
