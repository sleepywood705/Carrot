-- AlterTable
ALTER TABLE `Post` MODIFY `cost` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `isPaid` BOOLEAN NOT NULL DEFAULT false;
