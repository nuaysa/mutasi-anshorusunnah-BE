import { serializeBigInt } from "../../utils/helper";
import prisma from "../../prisma";

interface GetSantriByIdParams {
  id: string;
}
export const getSantriByIdService = async (params: GetSantriByIdParams) => {
  try {
    const { id } = params;

    const santri = await prisma.santri.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            category: true,
            vendor: true,
          },
          orderBy: { createdAt: "desc" },
        },
        debt: true,
      },
    });

    if (!santri) {
      throw new Error("Santri not found");
    }

    const totalDebt = santri.debt.reduce((sum, d) => sum + Number(d.remainingAmount), 0);

    const serializedData = {
      ...santri,
      deposit: santri.deposit.toString(),
      totalDebt,

      debt: santri.debt.map((d) => ({
        ...d,
        remainingAmount: d.remainingAmount.toString(),
      })),

      transactions: santri.transactions.map((t) => ({
        ...t,
        amount: t.amount.toString(),
      })),
    };

    return {
      message: "Santri data",
      data: serializeBigInt(serializedData),
    };
  } catch (err) {
    console.error("Error in getSantriByIdService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mendapatkan Detail Santri");
  }
};
