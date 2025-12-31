import prisma from "../../prisma";

interface EditTransactionServiceProps {
  id: string;
  santriId?: string;
  categoryId?: string;
  vendorId?: string;
  date?: string;
  amount?: number;
}

export const editTransactionService = async (data: EditTransactionServiceProps) => {
  try {
    const { id, santriId, date, amount, vendorId, categoryId } = data;

    const updateData: any = {};
    if (santriId !== undefined) updateData.santriId = santriId;
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = amount;
    if (vendorId !== undefined) updateData.vendorId = vendorId;
    if (categoryId !== undefined) updateData.class = categoryId;

    const Transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    return {
      message: "Transaction data",
      data: Transaction,
    };
  } catch (err) {
    console.error("Error in editTransactionService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mengedit Transaction");
  }
};
