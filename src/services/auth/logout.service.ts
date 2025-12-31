import { Request, Response } from "express";
import prisma from "../../prisma";
import jwt from "jsonwebtoken";
import { AppError, successResponse } from "../../utils/response";

const logoutService = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No token provided", 401, "TOKEN_MISSING");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isTokenValid: false },
  });

  return successResponse(res, null, 200, "Logout berhasil");
};

export default logoutService;
