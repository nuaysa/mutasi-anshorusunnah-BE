import prisma from "../../prisma";

interface CreateTransactionInput {
  santriId?: string | null;
  debtId?: string | null;
  categoryId: string;
  vendorId?: string | null;
  type: "income" | "expense";
  purpose: "deposit_topup" | "deposit_withdrawal" | "debt_created" | "debt_payment" | "other";
  amount: bigint;
  date: Date;
  description?: string;
}
export const createTransactionService = async (input: CreateTransactionInput) => {
  const { santriId, debtId, categoryId, vendorId, type, purpose, amount, date, description } = input;
  if (amount <= BigInt(0)) {
    throw new Error("Nominal harus lebih dari 0");
  }

  const expectedTypeMap: Partial<Record<CreateTransactionInput["purpose"], CreateTransactionInput["type"]>> = {
    deposit_topup: "income",
    deposit_withdrawal: "expense",
    debt_created: "income",
    debt_payment: "income",
  };

  const expectedType = expectedTypeMap[purpose];

  if (expectedType && type !== expectedType) {
    throw new Error(`Purpose ${purpose} harus bertipe ${expectedType}`);
  }

  const SANTRI_REQUIRED_PURPOSE: CreateTransactionInput["purpose"][] = ["deposit_topup", "deposit_withdrawal", "debt_created", "debt_payment"];

  if (SANTRI_REQUIRED_PURPOSE.includes(purpose) && !santriId) {
    throw new Error("Transaksi ini wajib memiliki santri");
  }

  return prisma.$transaction(async (tx) => {
    let santri = null;
    let debt = null;

    if (santriId) {
      santri = await tx.santri.findUnique({ where: { id: santriId } });
      if (!santri) throw new Error("Santri tidak ditemukan");
    }

    if (purpose === "debt_payment") {
      if (!debtId) throw new Error("debtId wajib untuk pembayaran hutang");

      debt = await tx.debt.findUnique({ where: { id: debtId } });
      if (!debt) throw new Error("Debt tidak ditemukan");
      if (debt.status === "paid") throw new Error("Debt sudah lunas");
    }

    const transaction = await tx.transaction.create({
      data: {
        santriId,
        debtId,
        categoryId,
        vendorId,
        type,
        purpose,
        amount,
        date,
        description,
      },
    });

    if (santri && purpose === "deposit_topup") {
      await tx.santri.update({
        where: { id: santri.id },
        data: {
          deposit: { increment: amount },
        },
      });
    }

    if (santri && purpose === "deposit_withdrawal") {
      if (santri.deposit < amount) {
        throw new Error("Saldo deposit tidak mencukupi");
      }

      await tx.santri.update({
        where: { id: santri.id },
        data: {
          deposit: { decrement: amount },
        },
      });
    }

    if (santri && purpose === "debt_created") {
      await tx.debt.create({
        data: {
          santriId: santri.id,
          info: description ?? "Hutang santri",
          totalAmount: amount,
          remainingAmount: amount,
          status: "open",
        },
      });
    }

    if (santri && purpose === "debt_payment" && debt) {
      if (amount <= debt.remainingAmount) {
        const remaining = debt.remainingAmount - amount;

        await tx.debt.update({
          where: { id: debt.id },
          data: {
            remainingAmount: remaining,
            status: remaining === BigInt(0) ? "paid" : "open",
          },
        });
      } else {
        const extra = amount - debt.remainingAmount;

        await tx.debt.update({
          where: { id: debt.id },
          data: {
            remainingAmount: BigInt(0),
            status: "paid",
          },
        });

        await tx.santri.update({
          where: { id: santri.id },
          data: {
            deposit: santri.deposit + extra,
          },
        });
      }
    }

    return transaction;
  });
};
