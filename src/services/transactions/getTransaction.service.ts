import prisma from "../../prisma";

interface GetTransactionByIdParams {
  TransactionId: string;
}

export const getTransactionByIdService = async (params: GetTransactionByIdParams) => {
  try {
    const { TransactionId } = params;

    const Transaction = await prisma.transaction.findUnique({
      where: {
        id: TransactionId,
      },
      include: {
        santri: true,
        category: true,
        vendor: true,
      },
    });

    if (!Transaction) {
      throw new Error("Transaction not found");
    }


    return {
      message: "Data Transaksi Berhasil Didapatkan",
      data: Transaction,
    };
  } catch (err) {
    console.error("Error in getTransactionByIdService:", err);
    throw err;
  }
};
