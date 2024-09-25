/*
  Warnings:

  - You are about to drop the column `bookerId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_bookerId_fkey`;

-- AlterTable
ALTER TABLE `Reservation` DROP COLUMN `bookerId`;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'DRIVER', 'TAXI', 'ADMIN') NOT NULL DEFAULT 'USER';
