import { verifyAdmin, verifyToken } from "../middleware/verify";
import { UserController } from "../controllers/users.controller";

import { Router } from "express";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, this.userController.getAllUserController);
    this.router.get("/:id", verifyToken, this.userController.getUserByIdController);
    this.router.patch("/edit/:id", verifyAdmin("admin"), verifyToken, this.userController.editUserController);
    this.router.delete("/delete/:id", verifyToken, verifyAdmin("admin"), this.userController.editUserController);
  }

  getRouter() {
    return this.router;
  }
}
