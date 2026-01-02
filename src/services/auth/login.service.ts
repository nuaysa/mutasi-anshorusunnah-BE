import { Request, Response } from "express";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, password } = req.body;

    if (!data || !password) {
      res.status(400).json({ message: "Email / Nama dan Password wajib diisi" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data }, { name: data }],
      },
    });

    if (!user) {
      res.status(400).json({ message: "Akun tidak ditemukan" });
      return;
    }

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      res.status(400).json({ message: "Email / Nama atau Password salah" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_KEY!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default loginService;
