import prisma from "../../prisma";

interface DeleteuserServiceProps {
  id: string;
}

export const deleteuserService = async (data: DeleteuserServiceProps) => {
  try {
    const { id } = data;

    const user = await prisma.user.delete({
      where: { id },
    });
    return {
      message: "user Berhasil Dihapus",
      data: user,
    };
  } catch (err) {
    console.error("Error in delete user service:", err);
    throw err instanceof Error ? err : new Error("Gagal Menghapus user");
  }
};
