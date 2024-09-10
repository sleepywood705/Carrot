-- DropForeignKey
ALTER TABLE `Reservastion` DROP FOREIGN KEY `Reservastion_bookedId_fkey`;

-- AddForeignKey
ALTER TABLE `Reservastion` ADD CONSTRAINT `Reservastion_bookedId_fkey` FOREIGN KEY (`bookedId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
