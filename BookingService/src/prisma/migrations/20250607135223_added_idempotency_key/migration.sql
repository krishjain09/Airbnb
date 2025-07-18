/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKeyId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `idempotencyKeyId` INTEGER NULL,
    ADD COLUMN `totalGuests` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `IdempotencyKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `IdempotencyKey_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_idempotencyKeyId_key` ON `Booking`(`idempotencyKeyId`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_idempotencyKeyId_fkey` FOREIGN KEY (`idempotencyKeyId`) REFERENCES `IdempotencyKey`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
