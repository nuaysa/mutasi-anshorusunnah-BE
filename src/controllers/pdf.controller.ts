import { Request, Response } from "express";
import { PdfService } from "../services/pdfService.service";
import { getSantriByIdService } from "../services/students/getStudent.service";
import { getTransactionByIdService } from "../services/transactions/getTransaction.service";
import { getTransactionsBySantriIdService } from "../services/transactions/getTransactionBySantriId.service";
import { getAllTransactionsService } from "../services/transactions/getAllTransactions.service";

export class PdfController {
  /**
   * ===============================
   * Download PDF transaksi (invoice style)
   * ===============================
   */
  downloadTransactionPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "ID transaksi tidak valid" });
        return;
      }

      const transactionRes = await getTransactionByIdService({
        TransactionId: id,
      });

      if (!transactionRes?.data) {
        res.status(404).json({ error: "Transaksi tidak ditemukan" });
        return;
      }

      const t = transactionRes.data;

      const pdfData = {
        id: t.id,
        date: t.date,
        type: t.type,
        purpose: t.purpose,
        amount: Number(t.amount),
        description: t.description || "-",
        categoryName: t.category?.name || "-",
        santriName: t.santri?.name ?? null,
        vendorName: t.vendor?.name ?? null,
      };

      const pdfBuffer = await PdfService.generateTransactionPdf(pdfData);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=transaksi-${id}.pdf`
      );
      res.setHeader("Content-Length", pdfBuffer.length.toString());

      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF TRANSACTION ERROR:", error);
      res.status(500).json({
        error: "Gagal generate PDF transaksi",
        detail: error instanceof Error ? error.message : error,
      });
    }
  };

  /**
   * ===============================
   * Download PDF semua transaksi (rekap)
   * ===============================
   */
  downloadAllTransactionPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const txsRes = await getAllTransactionsService({ size: 1000 });

      const transactions = Array.isArray(txsRes?.data)
        ? txsRes.data
        : [];

      const pdfBuffer = await PdfService.generateAllTransactionsPdf(
        transactions.map((tx) => ({
          id: tx.id,
          date: tx.date,
          type: tx.type,
          purpose: tx.purpose,
          amount: Number(tx.amount),
          categoryName: tx.category?.name || "-",
          santriName: tx.santri?.name || "-",
          vendorName: tx.vendor?.name || "-",
          description: tx.description
        }))
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=semua-transaksi-${Date.now()}.pdf`
      );
      res.setHeader("Content-Length", pdfBuffer.length.toString());

      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF ALL TRANSACTIONS ERROR:", error);
      res.status(500).json({
        error: "Gagal generate PDF semua transaksi",
        detail: error instanceof Error ? error.message : error,
      });
    }
  };

  /**
   * ===============================
   * Download PDF laporan santri
   * ===============================
   */
  downloadSantriReportPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      if (!id) {
        res.status(400).json({ error: "ID santri tidak valid" });
        return;
      }

      const santriRes = await getSantriByIdService({ id });

      if (!santriRes?.data) {
        res.status(404).json({ error: "Santri tidak ditemukan" });
        return;
      }

      const santri = santriRes.data;

      const txRes = await getTransactionsBySantriIdService({
        santriId: id,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      });

      const transactions = Array.isArray(txRes)
        ? txRes
        : [];

      const summary = this.calculateSantriSummary(santri, transactions);

      const pdfBuffer = await PdfService.generateSantriReportPdf(summary);

      const safeName = santri.name
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const fileName = `laporan-santri-${safeName}-${Date.now()}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
      );
      res.setHeader("Content-Length", pdfBuffer.length.toString());

      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF SANTRI ERROR:", error);
      res.status(500).json({
        error: "Gagal generate PDF santri",
        detail: error instanceof Error ? error.message : error,
      });
    }
  };

  /**
   * ===============================
   * Hitung summary keuangan santri
   * ===============================
   */
  private calculateSantriSummary(santri: any, transactions: any[]) {
    let totalDeposit = 0;
    let totalWithdrawal = 0;
    let totalDebt = 0;
    let totalPayment = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount || 0);

      switch (t.purpose) {
        case "deposit_topup":
          totalDeposit += amount;
          break;
        case "deposit_withdrawal":
          totalWithdrawal += amount;
          break;
        case "debt_created":
          totalDebt += amount;
          break;
        case "debt_payment":
          totalPayment += amount;
          break;
      }
    });

    const currentBalance = totalDeposit - totalWithdrawal;
    const remainingDebt = totalDebt - totalPayment;

    return {
      id: santri.id,
      name: santri.name,
      totalDeposit,
      totalWithdrawal,
      currentBalance,
      totalDebt,
      totalPayment,
      remainingDebt,
      transactions: transactions.map((t) => ({
        id: t.id,
        date: t.date,
        type: t.type,
        purpose: t.purpose,
        amount: Number(t.amount),
        description: t.description || "-",
        categoryName: t.category?.name || "-",
      })),
    };
  }
}

export default new PdfController();
