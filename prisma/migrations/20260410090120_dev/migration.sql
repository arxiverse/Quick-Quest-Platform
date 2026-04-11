/*
  Warnings:

  - The primary key for the `authentication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `authentication` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `authentication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `email` on the `authentication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `username` on the `authentication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `phone` on the `authentication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(16,0)`.
  - You are about to alter the column `authorization` on the `authentication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(24)`.
  - The primary key for the `user_identification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tags_skills` on the `user_identification` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `email` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `username` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(32)`.
  - You are about to alter the column `phone` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(16,0)`.
  - You are about to alter the column `fullname` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(84)`.
  - You are about to alter the column `province` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `city` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `district` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `sub_district` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `authorization` on the `user_identification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(24)`.
  - Made the column `auth_token` on table `authentication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `authentication` DROP FOREIGN KEY `authentication_user_id_fkey`;

-- DropIndex
DROP INDEX `authentication_email_key` ON `authentication`;

-- DropIndex
DROP INDEX `authentication_phone_key` ON `authentication`;

-- DropIndex
DROP INDEX `authentication_user_id_idx` ON `authentication`;

-- DropIndex
DROP INDEX `authentication_user_id_key` ON `authentication`;

-- DropIndex
DROP INDEX `authentication_username_key` ON `authentication`;

-- DropIndex
DROP INDEX `user_identification_email_key` ON `user_identification`;

-- DropIndex
DROP INDEX `user_identification_phone_key` ON `user_identification`;

-- DropIndex
DROP INDEX `user_identification_username_key` ON `user_identification`;

-- AlterTable
ALTER TABLE `authentication` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `email` VARCHAR(64) NOT NULL,
    MODIFY `username` VARCHAR(36) NOT NULL,
    MODIFY `phone` DECIMAL(16, 0) NOT NULL,
    MODIFY `authorization` VARCHAR(24) NOT NULL DEFAULT 'user',
    MODIFY `password` VARCHAR(124) NOT NULL,
    MODIFY `auth_token` VARCHAR(255) NOT NULL,
    MODIFY `created_at` DATE NULL,
    MODIFY `updated_at` DATE NULL,
    ADD PRIMARY KEY (`id`, `username`, `email`, `phone`);

-- AlterTable
ALTER TABLE `user_identification` DROP PRIMARY KEY,
    DROP COLUMN `tags_skills`,
    ADD COLUMN `tags_skill` TEXT NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `email` VARCHAR(40) NOT NULL,
    MODIFY `username` VARCHAR(32) NOT NULL,
    MODIFY `phone` DECIMAL(16, 0) NOT NULL,
    MODIFY `fullname` VARCHAR(84) NOT NULL,
    MODIFY `birthdate` DATE NOT NULL,
    MODIFY `province` VARCHAR(64) NOT NULL,
    MODIFY `city` VARCHAR(64) NOT NULL,
    MODIFY `district` VARCHAR(64) NOT NULL,
    MODIFY `sub_district` VARCHAR(64) NOT NULL,
    MODIFY `authorization` VARCHAR(24) NOT NULL DEFAULT 'user',
    MODIFY `created_at` DATE NULL,
    MODIFY `updated_at` DATE NULL,
    ADD PRIMARY KEY (`id`, `email`, `username`, `phone`);
