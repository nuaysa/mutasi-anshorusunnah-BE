/*
  Warnings:

  - You are about to drop the column `class` on the `Santri` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Santri" DROP COLUMN "class",
ADD COLUMN     "grade" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
