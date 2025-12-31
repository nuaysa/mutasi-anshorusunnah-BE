import { Request, Response } from "express";
import { createVendorService } from "../services/vendors/createVendor.service";
import { getAllVendorsService } from "../services/vendors/getAllVendors.service";
import { editVendorService } from "../services/vendors/editVendor.service";
import { deleteVendorService } from "../services/vendors/deleteVendor.service";

export class VendorController {
  async getVendorController(req: Request, res: Response) {
    try {
      const VendorData = await getAllVendorsService();
      res.status(200).send(VendorData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async deleteVendorController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const VendorData = await deleteVendorService({
        vendorId: id,
      });

      res.status(200).send(VendorData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async createVendorController(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const VendorData = await createVendorService({
        name: name,
      });
      res.status(200).send(VendorData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async editVendorController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const VendorData = await editVendorService({
        vendorId: id,
        name: name,
      });
      res.status(200).send(VendorData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }
}
