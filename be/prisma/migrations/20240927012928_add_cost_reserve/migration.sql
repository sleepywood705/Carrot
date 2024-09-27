/*
  Warnings:

  - You are about to alter the column `type` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `type` ENUM('USER', 'DRIVER', 'TAXI', 'ADMIN') NULL;

-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `cost` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'DRIVER', 'TAXI', 'ADMIN') NOT NULL DEFAULT 'USER';
