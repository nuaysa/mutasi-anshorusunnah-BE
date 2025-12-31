import { Transaction } from "../../generated/prisma/client";
import prisma from "../../prisma";
import { buildQuery, serializeBigInt } from "../../utils/helper";

export const getAllTransactionsService = async (query: any) => {
  try {
    const q = buildQuery<Transaction>(query, {
      searchable: ["id"],
      filterable: ["type", "vendorId", "categoryId"],
      defaultSize: 10,
    });

    if (query.date) {
   const start = new Date(query.date);
start.setHours(0, 0, 0, 0);

const end = new Date(query.date);
end.setHours(23, 59, 59, 999);

q.where.date = {
  gte: start,
  lte: end,
};
    }
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where: q.where,
        skip: q.skip,
        take: q.take,
        orderBy: { createdAt: "desc" },
        include: {
          vendor: true,
          category: true,
          santri: true,
        },
      }),
      prisma.transaction.count({ where: q.where }),
    ]);

    return {
      message: "Transactions data",
      data: serializeBigInt(data),
      meta: {
        total,
        page: q.meta.page,
        size: q.meta.size,
        totalPages: Math.ceil(total / q.meta.size),
      },
    };
  } catch (err) {
    console.error("Error in getAllTransactionsService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mendapatkan Data Transaksi");
  }
};
