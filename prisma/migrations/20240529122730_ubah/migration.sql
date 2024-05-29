/*
  Warnings:

  - You are about to drop the column `id_perangkat` on the `Riwayat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Riwayat" DROP CONSTRAINT "Riwayat_id_perangkat_fkey";

-- AlterTable
ALTER TABLE "Riwayat" DROP COLUMN "id_perangkat",
ADD COLUMN     "id_perangkatr" INTEGER;

-- AddForeignKey
ALTER TABLE "Riwayat" ADD CONSTRAINT "Riwayat_id_perangkatr_fkey" FOREIGN KEY ("id_perangkatr") REFERENCES "Perangkat"("id_perangkat") ON DELETE SET NULL ON UPDATE CASCADE;
