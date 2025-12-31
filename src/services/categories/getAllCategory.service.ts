import prisma from "../../prisma";

export const getAllCategoryService = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
    });
    return {
      message: "Berhasil mendapatkan kategori",
      data: categories,
    };
  } catch (err) {
    console.error("Error in getAllCategoryService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mendapatkan Semua Kategori");
  }
};
