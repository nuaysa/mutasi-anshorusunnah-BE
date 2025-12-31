import { StudentController } from "../controllers/students.controller";
import { verifyAdmin, verifyToken } from "../middleware/verify";

import { Router } from "express";

export class StudentsRouter {
  private studentsController: StudentController;
  private router: Router;

  constructor() {
    this.studentsController = new StudentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", verifyToken,verifyAdmin("admin"), this.studentsController.createStudentController);
    this.router.get("/", verifyToken, this.studentsController.getAllStudentController);
    this.router.get("/:id", verifyToken, this.studentsController.getStudentByIdController);
    this.router.patch("/edit/:id", verifyAdmin("admin"), verifyToken, this.studentsController.editStudentController);
  }

  getRouter() {
    return this.router;
  }
}
