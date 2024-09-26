/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Reservation` table. All the data in the column will be lost.
  - The values [TAXI] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `bookerId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `cost` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Reservation` DROP COLUMN `isPaid`,
    ADD COLUMN `bookerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_bookerId_fkey` FOREIGN KEY (`bookerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
