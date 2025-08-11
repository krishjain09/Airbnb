/*
  Warnings:

  - Added the required column `roomCategoryId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `roomCategoryId` INTEGER NOT NULL;
