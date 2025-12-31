-- CreateEnum
CREATE TYPE "TransactionPurpose" AS ENUM ('deposit_topup', 'debt_created', 'debt_payment', 'other');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "purpose" "TransactionPurpose" NOT NULL DEFAULT 'other';
