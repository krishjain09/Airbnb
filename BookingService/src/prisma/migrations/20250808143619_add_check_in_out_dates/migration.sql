/*
  Warnings:

  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `idempotencykey` DROP FOREIGN KEY `IdempotencyKey_bookingId_fkey`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `checkInDate` DATETIME(3) NOT NULL,
    ADD COLUMN `checkOutDate` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `IdempotencyKey` ADD CONSTRAINT `IdempotencyKey_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
