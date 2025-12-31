import prisma from "../../prisma";

export const getAllUserService = async () => {
  try {
    const User = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        password:true
      },
    });

    return {
      message: "User data",
      data: User,
    };
  } catch (err) {
    console.error("Error in getKomisiKategoriService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mendapatkan Data User");
  }
};
