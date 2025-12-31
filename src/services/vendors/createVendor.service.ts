import prisma from "../../prisma";

interface createVendorData {
  name: string;
}

export const createVendorService = async (VendorData: createVendorData) => {
  try {
    
    const {name} = VendorData;

    if (!name) throw new Error("Nama vendor harus diisi");
    
    const existingVendor = await prisma.vendor.findUnique({
      where: { name: name },
    });
    
    if (existingVendor && !existingVendor.isDeleted) {
      throw new Error("Vendor dengan nama ini sudah ada");
    }
    
    if (existingVendor && existingVendor.isDeleted) {
      const restored = await prisma.vendor.update({
        where: { id: existingVendor.id },
        data: {
          isDeleted: false,
        },
      });
    
      return {
        message: "vendor di-restore",
        data: restored,
      };
    }
    
    const newVendor = await prisma.vendor.create({
        data: {
            name: name
        }
    })

  
    return {
        "message": "vendor Berhasil Ditambahkan",
        "data":newVendor,
    };
  } catch (err) {
    console.error("Error in createProductService:", err);
    throw err instanceof Error ? err : new Error("Gagal Menambahkan vendor");
  }
};
