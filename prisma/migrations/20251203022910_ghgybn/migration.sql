-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `nidn` INTEGER NOT NULL,
    `nama_dosen` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nidn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Matakuliah` (
    `id_matakuliah` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_matakuliah` VARCHAR(191) NOT NULL,
    `id_dosen` INTEGER NOT NULL,
    `sks` INTEGER NOT NULL,

    PRIMARY KEY (`id_matakuliah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `nama_mahasiswa` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    UNIQUE INDEX `Mahasiswa_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penjadwalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dosen` INTEGER NOT NULL,
    `id_matakuliah` INTEGER NOT NULL,
    `jadwal` VARCHAR(191) NOT NULL,
    `jam_mulai` DATETIME(3) NOT NULL,
    `jam_selesai` DATETIME(3) NOT NULL,
    `hari` VARCHAR(191) NOT NULL DEFAULT 'Monday',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KRS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `penjadwalanId` INTEGER NOT NULL,
    `tahunAjaran` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Matakuliah` ADD CONSTRAINT `Matakuliah_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penjadwalan` ADD CONSTRAINT `Penjadwalan_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penjadwalan` ADD CONSTRAINT `Penjadwalan_id_matakuliah_fkey` FOREIGN KEY (`id_matakuliah`) REFERENCES `Matakuliah`(`id_matakuliah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_penjadwalanId_fkey` FOREIGN KEY (`penjadwalanId`) REFERENCES `Penjadwalan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
