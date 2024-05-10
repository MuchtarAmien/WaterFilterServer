-- CreateTable
CREATE TABLE "Perangkat" (
    "id_perangkat" SERIAL NOT NULL,
    "nama_alat" TEXT NOT NULL,
    "kode_unik" TEXT NOT NULL,
    "control_motor_dc" BOOLEAN NOT NULL,
    "monitor_tds" DOUBLE PRECISION NOT NULL,
    "monitor_ph" DOUBLE PRECISION NOT NULL,
    "monior_kekeruhan" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Perangkat_pkey" PRIMARY KEY ("id_perangkat")
);

-- CreateTable
CREATE TABLE "Riwayat" (
    "id_riwayat" SERIAL NOT NULL,
    "monitor_tds" DOUBLE PRECISION NOT NULL,
    "monitor_ph" DOUBLE PRECISION NOT NULL,
    "monior_kekeruhan" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "id_perangkat" INTEGER,

    CONSTRAINT "Riwayat_pkey" PRIMARY KEY ("id_riwayat")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perangkat_nama_alat_key" ON "Perangkat"("nama_alat");

-- CreateIndex
CREATE UNIQUE INDEX "Perangkat_kode_unik_key" ON "Perangkat"("kode_unik");

-- AddForeignKey
ALTER TABLE "Perangkat" ADD CONSTRAINT "Perangkat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riwayat" ADD CONSTRAINT "Riwayat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riwayat" ADD CONSTRAINT "Riwayat_id_perangkat_fkey" FOREIGN KEY ("id_perangkat") REFERENCES "Perangkat"("id_perangkat") ON DELETE SET NULL ON UPDATE CASCADE;
