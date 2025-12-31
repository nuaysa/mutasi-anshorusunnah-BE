import prisma from "../../prisma";

interface editVendorData {
  vendorId: string;
  name: string;
}

export const editVendorService = async (VendorData: editVendorData) => {
  try {
    if (!VendorData.vendorId) throw new Error("Tentukan id vendor yang ingin diubah");
    if (!VendorData.name) throw new Error("Nama vendor harus diisi");

    const result = await prisma.$transaction(async (prisma) => {
      const updatedVendor = await prisma.vendor.update({
        where: { id: VendorData.vendorId },
        data: { name: VendorData.name },
      });

      return { Vendor: updatedVendor };
    });

    return {
      message: "vendor Berhasil Diubah",
      data: result.Vendor,
    };
  } catch (err) {
    console.error("Error in editVendorService:", err);
    throw err instanceof Error ? err : new Error("Gagal mengedit vendor");
  }
};
