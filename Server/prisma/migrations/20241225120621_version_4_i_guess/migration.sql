/*
  Warnings:

  - Added the required column `reference` to the `finePayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finePayment" ADD COLUMN     "reference" TEXT NOT NULL;
