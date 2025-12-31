import { Router } from "express";
import { verifyToken } from "../middleware/verify";
import { PdfController } from "../controllers/pdf.controller";

export class PdfRouter {
  private pdfController: PdfController;
  private router: Router;

  constructor() {
    this.pdfController = new PdfController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get( '/transactions/:id', verifyToken, this.pdfController.downloadTransactionPdf);
    this.router.get( '/transactions/', verifyToken, this.pdfController.downloadAllTransactionPdf);
    this.router.get( '/santri/:id', verifyToken, this.pdfController.downloadSantriReportPdf);
  }

  getRouter() {
    return this.router;
  }
}