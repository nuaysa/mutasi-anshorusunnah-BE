import { Request, Response } from "express";
import { deleteCategoryService } from "../services/categories/deleteCategory.service";
import { createCategoryService } from "../services/categories/createCategory.service";
import { getAllCategoryService } from "../services/categories/getAllCategory.service";
import { editCategoryService } from "../services/categories/editCategory.service";
import { errorResponse } from "../utils/response";

export class CategoryController {
  async getCategoryController(req: Request, res: Response) {
    try {
      const CategoryData = await getAllCategoryService();
      res.status(200).send(CategoryData);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async deleteCategoryController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const CategoryData = await deleteCategoryService({
        categoryId: id,
      });

      res.status(200).send(CategoryData);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async createCategoryController(req: Request, res: Response) {
    try {
      const { name } = req.body;
      console.log("REQ BODY:", req.body);

      const CategoryData = await createCategoryService({
        name: name,
      });
      res.status(200).send(CategoryData);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }

  async editCategoryController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const CategoryData = await editCategoryService({
        categoryId: id,
        name: name,
      });
      res.status(200).send(CategoryData);
    } catch (err: any) {
      return errorResponse(res, {
        error: "Application Error",
        message: err.message,
        status: 400,
      });
    }
  }
}
