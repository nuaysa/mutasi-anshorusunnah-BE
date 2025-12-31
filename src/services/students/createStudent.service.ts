import prisma from "../../prisma";

interface createStudentData {
  name: string;
  grade: string;
  generation: number;
  status: "active" | "inactive" | "graduated" | "stopped";
}

export const createSantriService = async (StudentData: createStudentData) => {
  try {
    const { name, grade, generation, status } = StudentData;

    if (!name) throw new Error("Nama Santri harus diisi");
    if (!grade) throw new Error("Kelas Santri harus diisi");
    if (!generation) throw new Error("Angkatan Santri harus diisi");

  const newStudent = await prisma.santri.create({
  data: {
    name,
    grade,
    generation,
    status,
  },
  select: {
    id: true,
    name: true,
    grade: true,
    generation: true,
    status: true,
    createdAt: true,
  },
});

return {
  message: "Santri Berhasil Ditambahkan",
  data: {
    ...newStudent,
  },
};

  } catch (err) {
    console.error("Error in createProductService:", err);
    throw err instanceof Error ? err : new Error("Gagal Menambahkan Santri");
  }
};
