/*
  Warnings:

  - You are about to drop the column `amount` on the `Debt` table. All the data in the column will be lost.
  - Added the required column `remainingAmount` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('open', 'paid');

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "amount",
ADD COLUMN     "remainingAmount" BIGINT NOT NULL,
ADD COLUMN     "status" "DebtStatus" NOT NULL DEFAULT 'open',
ADD COLUMN     "totalAmount" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "debtId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
