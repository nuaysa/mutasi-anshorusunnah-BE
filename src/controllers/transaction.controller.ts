import { Request, Response } from "express";
import { getAllTransactionsService } from "../services/transactions/getAllTransactions.service";
import { editTransactionService } from "../services/transactions/editTransaction.service";
import { getTransactionByIdService } from "../services/transactions/getTransaction.service";
import { createTransactionService } from "../services/transactions/createTransaction.service";
import { getSantriDebtsService } from "../services/transactions/getDebts.service";
import { serializeBigInt } from "../utils/helper";

export class TransactionController {
  async getAllTransactionsController(req: Request, res: Response) {
    try {
      
      const TransactionData = await getAllTransactionsService(req.query);
      res.status(200).send(TransactionData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async getTransactionByIdController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const Transaction = await getTransactionByIdService({
        TransactionId: id,
      });

      res.status(200).send(Transaction);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }
  async getDebtsByIdController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.query;

      const Transaction = await getSantriDebtsService({
        id: id,
        status: status as "paid" | "open" | undefined,
      });

      res.status(200).send(Transaction);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async editTransactionController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { santriId, date, amount, vendorId, categoryId } = req.body;

      const TransactionData = await editTransactionService({
        id: id,
        santriId: santriId,
        categoryId: categoryId,
        vendorId: vendorId,
        date: date,
        amount: amount,
      });
      res.status(200).send(TransactionData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async createTransactionController(req: Request, res: Response) {
    try {
      const { santriId, debtId, categoryId, vendorId, type, amount, purpose, date, description } = req.body;

      function parseDate(value: string): Date {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) {
          throw new Error("Tanggal tidak valid");
        }
        return d;
      }

      const dateParsed = parseDate(date);

      const TransactionData = await createTransactionService({
        debtId: debtId,
        type: type,
        purpose: purpose,
        description: description,
        santriId: santriId,
        categoryId: categoryId,
        vendorId: vendorId,
        date: dateParsed,
        amount: BigInt(amount),
      });

res.json(serializeBigInt(TransactionData))
      res.status(200).send(TransactionData);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }
}
