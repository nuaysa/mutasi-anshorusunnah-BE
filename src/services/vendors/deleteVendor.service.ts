import prisma from "../../prisma";

interface deleteVendorData {
  vendorId: string;
}

export const deleteVendorService = async (VendorData: deleteVendorData) => {
  try {
    const { vendorId } = VendorData;

    if (!vendorId) throw new Error("tentukan id vendor yang ingin dihapus");

    const deletedVendor = await prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        isDeleted: true,
      },
    });

    return {
      message: "vendor berhasil dihapus",
      data: deletedVendor,
    };
  } catch (err) {
    console.error("Error in deleteVendorService:", err);
    throw err instanceof Error ? err : new Error("Gagal Menghapus vendor");
  }
};
