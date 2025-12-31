import { getUserByIdService } from "../services/users/getUser.service";
import { editUserService } from "../services/users/editUser.service";
import { getAllUserService } from "../services/users/getAllUser.service";
import { Request, Response } from "express";
import { deleteuserService } from "../services/users/deleteUser.service";
import { errorResponse } from "@/utils/response";

export class UserController {
  async getUserByIdController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const User = await getUserByIdService({
        UserId: id,
      });

      res.status(200).send(User);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async getAllUserController(req: Request, res: Response) {
    try {
      const User = await getAllUserService();

      res.status(200).send(User);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async editUserController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nama, role, password } = req.body;

      const User = await editUserService({
        id: id,
        nama: nama,
        role: role,
        password: password,
      });

      res.status(200).send(User);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async deleteUserController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const User = await deleteuserService({
        id: id,
      });

      res.status(200).send(User);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }
}
