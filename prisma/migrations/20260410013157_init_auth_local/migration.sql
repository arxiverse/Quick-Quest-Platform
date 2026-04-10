-- CreateTable
CREATE TABLE `user_identification` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `sub_district` VARCHAR(191) NOT NULL,
    `full_address` TEXT NOT NULL,
    `tags_skills` TEXT NOT NULL,
    `authorization` VARCHAR(191) NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_identification_email_key`(`email`),
    UNIQUE INDEX `user_identification_username_key`(`username`),
    UNIQUE INDEX `user_identification_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authentication` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `authorization` VARCHAR(191) NOT NULL DEFAULT 'user',
    `password` TEXT NOT NULL,
    `auth_token` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `authentication_user_id_key`(`user_id`),
    UNIQUE INDEX `authentication_email_key`(`email`),
    UNIQUE INDEX `authentication_username_key`(`username`),
    UNIQUE INDEX `authentication_phone_key`(`phone`),
    INDEX `authentication_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `authentication` ADD CONSTRAINT `authentication_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_identification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
