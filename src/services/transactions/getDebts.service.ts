import prisma from "../../prisma";

interface GetSantriDebtsParams {
  id: string;
  status?: "open" | "paid";
}

export const getSantriDebtsService = async ({
  id,
  status = "open",
}: GetSantriDebtsParams) => {
  const debts = await prisma.debt.findMany({
    where: {
      santriId: id,
      status,
    },
    select: {
      id: true,
      remainingAmount: true,
      totalAmount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const data = debts.map((d) => ({
    ...d,
    remainingAmount: d.remainingAmount.toString(),
    totalAmount: d.totalAmount.toString(),
  }));

  return {
    message: "Debt santri",
    data,
  };
};
