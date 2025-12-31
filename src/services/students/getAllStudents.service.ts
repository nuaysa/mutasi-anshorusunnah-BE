import { Santri } from "../../generated/prisma/client";
import prisma from "../../prisma";
import { buildQuery, serializeBigInt } from "../../utils/helper";

export const getAllSantriService = async (query: any) => {
  try {
    const q = buildQuery<Santri>(query, {
      searchable: ["name"],
      filterable: ["status", "generation"],
      defaultSize: 10,
    });

    const [data, total] = await Promise.all([
      prisma.santri.findMany({
        where: q.where,
        skip: q.skip,
        take: q.take,
        orderBy: { createdAt: "desc" },
        include: {
          debt: true,
        },
      }),
      prisma.santri.count({ where: q.where }),
    ]);

   const serializedData = data.map((santri) => {
      const totalDebt = santri.debt.reduce(
        (sum, d) => sum + Number(d.remainingAmount),
        0
      );

      return {
        ...santri,
        deposit: santri.deposit.toString(),
        totalDebt,
        debt: santri.debt.map((d) => ({
          ...d,
          remainingAmount: d.remainingAmount.toString(),
        })),
      };
    });

    return {
      message: "Santri data",
      data: serializeBigInt(serializedData),
      meta: {
        total,
        page: q.meta.page,
        size: q.meta.size,
        totalPages: Math.ceil(total / q.meta.size),
      },
    };
  } catch (err) {
    console.error("Error in getAllSantriService:", err);
    throw err instanceof Error
      ? err
      : new Error("Gagal Mendapatkan Data Santri");
  }
};