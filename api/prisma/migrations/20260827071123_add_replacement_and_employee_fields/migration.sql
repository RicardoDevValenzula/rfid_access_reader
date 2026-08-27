-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `dependencia` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `pension` VARCHAR(191) NULL,
    ADD COLUMN `telefono` VARCHAR(191) NULL,
    ADD COLUMN `tipo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Replacement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalEmployeeId` INTEGER NOT NULL,
    `replacementEmployeeId` INTEGER NOT NULL,
    `kioskId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Replacement` ADD CONSTRAINT `Replacement_originalEmployeeId_fkey` FOREIGN KEY (`originalEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Replacement` ADD CONSTRAINT `Replacement_replacementEmployeeId_fkey` FOREIGN KEY (`replacementEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
