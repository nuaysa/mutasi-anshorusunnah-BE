import { NextFunction, Request, Response } from "express";
import { findUser} from "../../libs/register.service";
import prisma from "../../prisma";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).send({ message: "All fields are required" });
      return;
    }

    const existingUser = await findUser(email);
    if (existingUser) {
      res.status(400).send({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        role,
        name,
        email,
        password: hashedPassword,
        isTokenValid: false
      },
    });

    const payload = { id: user.id };
    const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });


    res.status(201).send({
      message:
        "user Berhasil Dibuat!",
      user,
      token : token
    });
  } catch (err : any) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .send({ message: "An error occurred during registration", error: err.message });
  }
};
