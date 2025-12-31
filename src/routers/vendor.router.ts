import { VendorController } from "../controllers/vendor.controller";
import { verifyAdmin, verifyToken } from "../middleware/verify";
import { Router } from "express";

export class VendorRouter {
  private vendorController: VendorController;
  private router: Router;

  constructor() {
    this.vendorController = new VendorController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", verifyToken, verifyAdmin("admin"), this.vendorController.createVendorController);
    this.router.get("/", verifyToken, this.vendorController.getVendorController);
    this.router.patch("/:id", verifyToken, verifyAdmin("admin"), this.vendorController.editVendorController);
    this.router.patch("/delete/:id", verifyToken, verifyAdmin("admin"), this.vendorController.deleteVendorController);
  }

  getRouter() {
    return this.router;
  }
}
