import prisma from "../../prisma";

export const getAllVendorsService = async () => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        isDeleted: false,
      },
    });
    return {
      message: "Berhasil mendapatkan vendor",
      data: vendors,
    };
  } catch (err) {
    console.error("Error in getAllVendorsService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mendapatkan Semua vendor");
  }
};
