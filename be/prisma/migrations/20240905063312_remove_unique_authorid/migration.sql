/*
  Warnings:

  - You are about to drop the column `bookedId` on the `Reservastion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Reservastion` DROP FOREIGN KEY `Reservastion_bookedId_fkey`;

-- AlterTable
ALTER TABLE `Reservastion` DROP COLUMN `bookedId`;
