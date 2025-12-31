import prisma from "../../prisma";

interface deleteCategoryData {
  categoryId: string;
}

export const deleteCategoryService = async (categoryData: deleteCategoryData) => {
  try {
    const { categoryId } = categoryData;

    if (!categoryId) throw new Error("tentukan id kategori yang ingin dihapus");

    const deletedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        isDeleted: true,
      },
    });

    return {
      message: "Kategori berhasil dihapus",
      data: deletedCategory,
    };
  } catch (err) {
    console.error("Error in deleteCategoryService:", err);
    throw err instanceof Error ? err : new Error("Gagal Menghapus Kategori");
  }
};
