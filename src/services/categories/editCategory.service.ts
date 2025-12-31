import prisma from "../../prisma";

interface editCategoryData {
  categoryId: string;
  name: string;
}

export const editCategoryService = async (categoryData: editCategoryData) => {
  try {
    if (!categoryData.categoryId) throw new Error("Tentukan id kategori yang ingin diubah");
    if (!categoryData.name) throw new Error("Nama kategori harus diisi");

    const result = await prisma.$transaction(async (prisma) => {
      const updatedCategory = await prisma.category.update({
        where: { id: categoryData.categoryId },
        data: { name: categoryData.name },
      });

      return { category: updatedCategory };
    });

    return {
      message: "Kategori Berhasil Diubah",
      data: result.category,
    };
  } catch (err) {
    console.error("Error in editCategoryService:", err);
    throw err instanceof Error ? err : new Error("Gagal mengedit Kategori");
  }
};
