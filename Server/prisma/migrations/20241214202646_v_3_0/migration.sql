/*
  Warnings:

  - You are about to drop the column `isbn` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `total_copies` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `finished_date` on the `booksRead` table. All the data in the column will be lost.
  - Added the required column `description` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_isbn_key";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "isbn",
DROP COLUMN "total_copies",
ADD COLUMN     "cover_image" BYTEA,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "booksRead" DROP COLUMN "finished_date";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phone_number" DROP NOT NULL;

-- CreateTable
CREATE TABLE "isbn" (
    "isbn" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "isbn_pkey" PRIMARY KEY ("isbn")
);

-- AddForeignKey
ALTER TABLE "isbn" ADD CONSTRAINT "isbn_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
