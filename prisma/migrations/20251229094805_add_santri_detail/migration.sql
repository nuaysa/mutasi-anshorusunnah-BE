-- AlterTable
ALTER TABLE "Santri" ADD COLUMN     "deposit" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "santriId" TEXT,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri"("id") ON DELETE SET NULL ON UPDATE CASCADE;
