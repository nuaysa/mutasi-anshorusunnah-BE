import prisma from "../../prisma";

interface createCategoryData {
  name: string;
}

export const createCategoryService = async (categoryData: createCategoryData) => {
  try {
    
    const {name} = categoryData;

    if (!name) throw new Error("Nama kategori harus diisi");
    
    const existingCategory = await prisma.category.findUnique({
      where: { name: name },
    });
    
    if (existingCategory && !existingCategory.isDeleted) {
      throw new Error("Kategori dengan nama ini sudah ada");
    }
    
    if (existingCategory && existingCategory.isDeleted) {
      const restored = await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          isDeleted: false,
        },
      });
    
      return {
        message: "Kategori di-restore",
        data: restored,
      };
    }
    
    const newCategory = await prisma.category.create({
        data: {
            name: name
        }
    })

  
    return {
        "message": "Kategori Berhasil Ditambahkan",
        "data":newCategory,
    };
  } catch (err) {
    console.error("Error in createProductService:", err);
    throw err instanceof Error ? err : new Error("Gagal Menambahkan Kategori");
  }
};
