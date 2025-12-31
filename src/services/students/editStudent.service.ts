import prisma from "../../prisma";

interface EditSantriServiceProps {
  id: string;
  name?: string;
  grade?: string;
  status?: "active" | "inactive" | "graduated" | "stopped";
  generation?: number;
}

export const editSantriService = async (data: EditSantriServiceProps) => {
  try {
    const { id, name, generation, status, grade } = data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (generation !== undefined) updateData.generation = generation;
    if (status !== undefined) updateData.status = status;
    if (grade !== undefined) updateData.grade = grade;

    const Santri = await prisma.santri.update({
      where: { id },
      data: updateData,
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
      message: "Santri data",
      data: Santri,
    };
  } catch (err) {
    console.error("Error in editSantriService:", err);
    throw err instanceof Error ? err : new Error("Gagal Mengedit Santri");
  }
};
