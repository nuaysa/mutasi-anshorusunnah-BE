import { TransactionController } from "../controllers/transaction.controller";
import { verifyAdmin, verifyToken } from "../middleware/verify";

import { Router } from "express";

export class TransactionsRouter {
  private transactionsController: TransactionController;
  private router: Router;

  constructor() {
    this.transactionsController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, this.transactionsController.getAllTransactionsController);
    this.router.get("/debts/:id", verifyToken, this.transactionsController.getDebtsByIdController);
    this.router.post("/", verifyToken, this.transactionsController.createTransactionController);
    this.router.get("/:id", verifyToken, this.transactionsController.getTransactionByIdController);
    this.router.patch("/edit/:id", verifyAdmin("admin"), verifyToken, this.transactionsController.editTransactionController);
  }

  getRouter() {
    return this.router;
  }
}
