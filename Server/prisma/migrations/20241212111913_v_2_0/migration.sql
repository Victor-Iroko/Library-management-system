/*
  Warnings:

  - You are about to drop the column `copies_available` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `outstanding_fines` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "copies_available";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "outstanding_fines";
