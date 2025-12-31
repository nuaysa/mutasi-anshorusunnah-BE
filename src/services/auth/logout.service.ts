import { Request, Response } from "express";
import prisma from "../../prisma";

const logoutService = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request Body:", req.body);

    // Validasi input
    if (!req.body || !req.body.token  || !req.body.id) {
      res.status(400).json({ message: "Token wajib diisi" });
      return;
    }

    // cek token valid
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ isTokenValid: true, id: req.body.id }],
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      throw new Error("Akun Tidak Ditemukan!");
    }


    // Jika akun belum diverifikasi
    // if (!user.verifikasi) {
    //   throw new Error("Akun Belum Terverifikasi! Pastikan Anda Sudah Melakukan Verifikasi Akun");
    // }

    const payload = {
     token : req.body.token,
     id: user.id,
    };

   await prisma.user.update({
      where: { id: payload.id },
      data: { isTokenValid: false },
    });

    res.status(200).json({ message: "Logout Berhasil", user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export default logoutService;