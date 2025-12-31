import { verifyAdmin, verifyToken } from "../middleware/verify";
import { CategoryController } from "../controllers/category.controller";
import { Router } from "express";

export class CategoryRouter {
  private categoryController: CategoryController;
  private router: Router;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", verifyToken, verifyAdmin("admin"), this.categoryController.createCategoryController);
    this.router.get("/", verifyToken, this.categoryController.getCategoryController);
    this.router.patch("/:id", verifyToken, verifyAdmin("admin"), this.categoryController.editCategoryController);
    this.router.patch("/delete/:id", verifyToken, verifyAdmin("admin"), this.categoryController.deleteCategoryController);
  }

  getRouter() {
    return this.router;
  }
}
