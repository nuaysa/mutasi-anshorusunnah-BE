import { Request, Response } from "express";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const loginService = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request Body:", req.body);

    // Validasi input
    if (!req.body || !req.body.data || !req.body.password) {
      res.status(400).json({ message: "Email atau Nama dan Password wajib diisi" });
      return;
    }
  
    const { data, password } = req.body;

    // Cari user berdasarkan email / username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data }, { name: data }],
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      throw new Error("Akun Tidak Ditemukan!");
    }

    if (user.isTokenValid === true) {
      throw new Error("Token masih valid!");
    }

    // Validasi password
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      throw new Error("Password, email atau nama Salah!");
    }

    // Jika akun belum diverifikasi
    // if (!user.verifikasi) {
    //   throw new Error("Akun Belum Terverifikasi! Pastikan Anda Sudah Melakukan Verifikasi Akun");
    // }

    // Buat token JWT untuk user
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

    await prisma.user.update({
      where: { id: payload.id },
      data: { isTokenValid: true },
    });

    console.log("Generated Token:", token, "id:", payload.id);

    res.status(200).json({ message: "Login Berhasil", user, token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export default loginService;