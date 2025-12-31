import prisma from "../../prisma";


interface GetTransactionsBySantriIdParams {
  santriId: string;
  startDate?: string;
  endDate?: string;
}

export async function getTransactionsBySantriIdService({
  santriId,
  startDate,
  endDate,
}: GetTransactionsBySantriIdParams) {
  try {
    // Build where clause
    const whereClause: any = {
      santriId,
    };

    // Add date filter if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    // Query transactions
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        santri: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return transactions;
  } catch (error) {
    console.error("Error getting transactions by santri ID:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}