import PDFDocument from "pdfkit";

/* =========================
   TYPES & INTERFACES
========================= */

export interface TransactionPdfData {
  id: string;
  date: string | Date;
  type: "income" | "expense";
  purpose: string;
  amount: number;
  description?: string | null;
  categoryName: string;
  santriName?: string | null;
  vendorName?: string | null;
}

export interface SantriSummaryPdfData {
  id: string;
  name: string;
  totalDeposit: number;
  totalWithdrawal: number;
  currentBalance: number;
  totalDebt: number;
  totalPayment: number;
  remainingDebt: number;
  transactions: TransactionPdfData[];
}

/* =========================
   CONSTANTS & CONFIGURATION
========================= */

const PDF_CONFIG = {
  PAGE: { MARGIN: 50, WIDTH: 595.28, HEIGHT: 841.89 },
  COLORS: {
    PRIMARY: "#0D9488", // Dark Blue
    SUCCESS: "#038c56", // Green
    DANGER: "#DC2626", // Red
    WARNING: "#ba8b00", // Orange
    GRAY: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      500: "#6B7280",
      700: "#374151",
      900: "#111827",
    },
  },
  FONTS: { TITLE: 22, SUBTITLE: 16, HEADER: 12, BODY: 10, SMALL: 9, CAPTION: 8 },
} as const;

const PURPOSE_LABELS: Record<string, string> = {
  deposit_topup: "Topup Deposit",
  deposit_withdrawal: "Penarikan Deposit",
  debt_created: "Pembuatan Hutang",
  debt_payment: "Pembayaran Hutang",
  other: "Lainnya",
};

/* =========================
   PDF SERVICE
========================= */

export class PdfService {
  /**
   * 1. GENERATE INVOICE (Single Transaction)
   */
  static async generateTransactionPdf(transaction: TransactionPdfData): Promise<Buffer> {
    return this.createPdfDocument((doc) => {
      this.drawModernHeader(doc, "BUKTI TRANSAKSI");

      const startY = 120;
      // Info Box (Right)
      doc.rect(350, startY, 195, 75).fill(PDF_CONFIG.COLORS.GRAY[50]);
      doc.fillColor(PDF_CONFIG.COLORS.GRAY[700]).fontSize(PDF_CONFIG.FONTS.SMALL);
      doc.fillColor(PDF_CONFIG.COLORS.GRAY[700]).text("TIPE", 360, startY + 10);
      doc.fillColor("black").text((transaction.type === "income" ? "Pemasukan" : "Pengeluaran"), 360, startY + 20);
      doc.fillColor(PDF_CONFIG.COLORS.GRAY[700]).fontSize(PDF_CONFIG.FONTS.SMALL);
      doc.fillColor(PDF_CONFIG.COLORS.GRAY[700]).text("TANGGAL", 360, startY + 35);
     doc.fillColor("black").text(this.formatDate(transaction.date), 360, startY + 45);

      // Recipient (Left)
      doc.fontSize(PDF_CONFIG.FONTS.HEADER).fillColor(PDF_CONFIG.COLORS.PRIMARY).text("DITUJUKAN KEPADA:", 360, startY + 65);
      doc.moveDown(0.3);
      doc
        .fontSize(PDF_CONFIG.FONTS.SUBTITLE)
        .fillColor("black")
        .text(transaction.santriName || transaction.vendorName || "Umum");
      doc
        .fontSize(PDF_CONFIG.FONTS.BODY)
        .fillColor(PDF_CONFIG.COLORS.GRAY[500])
        .text(transaction.santriName ? "Santri" : "Pihak Eksternal");

      // Table
      doc.moveDown(4);
      const tableTop = doc.y;
      doc.rect(50, tableTop, 495, 25).fill(PDF_CONFIG.COLORS.PRIMARY);
      doc
        .fillColor("white")
        .fontSize(PDF_CONFIG.FONTS.SMALL)
        .text("DESKRIPSI KATEGORI", 60, tableTop + 8);
      doc.text("TOTAL", 400, tableTop + 8, { width: 135, align: "right" });

      doc
        .fillColor("black")
        .fontSize(PDF_CONFIG.FONTS.BODY)
        .text(`${transaction.categoryName}  -  ${transaction.description || this.getPurposeLabel(transaction.purpose)}`, 60, tableTop + 35, { width: 320 });
      doc.text(this.formatIDR(transaction.amount), 400, tableTop + 35, { width: 135, align: "right" });

      // Total Box
      doc.moveDown(4);
      const totalY = doc.y;
      doc.rect(300, totalY, 245, 45).fill(PDF_CONFIG.COLORS.GRAY[100]);
      doc
        .fillColor(PDF_CONFIG.COLORS.GRAY[700])
        .fontSize(PDF_CONFIG.FONTS.SMALL)
        .text("TOTAL BAYAR", 310, totalY + 17);
      doc
        .fillColor(PDF_CONFIG.COLORS.PRIMARY)
        .fontSize(PDF_CONFIG.FONTS.SUBTITLE)
        .text(this.formatIDR(transaction.amount), 350, totalY + 15, { align: "right", width: 185 });

      this.drawDocumentFooter(doc);
    });
  }

  /**
   * 2. GENERATE ALL TRANSACTIONS (Table List)
   */
  static async generateAllTransactionsPdf(transactions: TransactionPdfData[]): Promise<Buffer> {
    return this.createPdfDocument((doc) => {
      this.drawModernHeader(doc, "LAPORAN SEMUA TRANSAKSI");

      doc.fontSize(PDF_CONFIG.FONTS.BODY).fillColor(PDF_CONFIG.COLORS.GRAY[700]).text(`Total Catatan: ${transactions.length} Transaksi`, 50, doc.y);
      doc.moveDown(1);

      this.drawTransactionTable(doc, transactions, true);
      this.drawDocumentFooter(doc);
    });
  }

  /**
   * 3. GENERATE SANTRI REPORT (Summary + Table)
   */
  static async generateSantriReportPdf(santri: SantriSummaryPdfData): Promise<Buffer> {
    return this.createPdfDocument((doc) => {
      this.drawModernHeader(doc, "LAPORAN KEUANGAN SANTRI");

      // Santri Info
      doc.fontSize(PDF_CONFIG.FONTS.HEADER).fillColor(PDF_CONFIG.COLORS.PRIMARY).text("PROFIL SANTRI");
      doc.fontSize(PDF_CONFIG.FONTS.SUBTITLE).fillColor("black").text(santri.name);
      doc.fontSize(PDF_CONFIG.FONTS.BODY).fillColor(PDF_CONFIG.COLORS.GRAY[500]).text(`ID: ${santri.id}`);
      doc.moveDown(1.5);

      // Summary Cards
      const cardY = doc.y;
      this.drawStatCard(doc, 50, cardY, 155, "Saldo Saat Ini", santri.currentBalance, "primary");
      this.drawStatCard(doc, 220, cardY, 155, "Total Hutang", santri.totalDebt, "warning");
      this.drawStatCard(doc, 390, cardY, 155, "Sisa Hutang", santri.remainingDebt, "danger");

      doc.moveDown(6);
      doc.fontSize(PDF_CONFIG.FONTS.SUBTITLE).fillColor(PDF_CONFIG.COLORS.PRIMARY).text("RIWAYAT TRANSAKSI");
      doc.moveDown(0.5);

      this.drawTransactionTable(doc, santri.transactions, false); // false = sembunyikan kolom Nama (karena sudah di header)
      this.drawDocumentFooter(doc);
    });
  }

  /* =========================
     PRIVATE DRAWING HELPERS
  ========================= */

  private static drawModernHeader(doc: PDFKit.PDFDocument, title: string): void {
    doc.rect(0, 0, PDF_CONFIG.PAGE.WIDTH, 40).fill(PDF_CONFIG.COLORS.PRIMARY);
    doc.fillColor("white").fontSize(14).text("ANSHORUSUNNAH", 50, 15, { characterSpacing: 1 });
    doc.fillColor(PDF_CONFIG.COLORS.GRAY[900]).fontSize(PDF_CONFIG.FONTS.TITLE).text(title, 50, 65, { align: "right" });
    doc.moveTo(50, 100).lineTo(545, 100).strokeColor(PDF_CONFIG.COLORS.GRAY[200]).stroke();
    doc.moveDown(2);
  }

  private static drawStatCard(doc: PDFKit.PDFDocument, x: number, y: number, w: number, label: string, value: number, theme: string) {
    const color = theme === "danger" ? PDF_CONFIG.COLORS.DANGER : theme === "warning" ? PDF_CONFIG.COLORS.WARNING : PDF_CONFIG.COLORS.PRIMARY;
    doc.rect(x, y, w, 60).fill(PDF_CONFIG.COLORS.GRAY[50]).stroke(PDF_CONFIG.COLORS.GRAY[200]);
    doc.rect(x, y, 4, 60).fill(color);
    doc
      .fillColor(PDF_CONFIG.COLORS.GRAY[500])
      .fontSize(PDF_CONFIG.FONTS.CAPTION)
      .text(label.toUpperCase(), x + 12, y + 15);
    doc
      .fillColor("black")
      .fontSize(PDF_CONFIG.FONTS.HEADER)
      .text(this.formatIDR(value), x + 12, y + 30);
  }

  private static drawTransactionTable(doc: PDFKit.PDFDocument, transactions: TransactionPdfData[], showName: boolean): void {
    const startX = 50;
    let currentY = doc.y;

    const drawHeader = (y: number) => {
      doc.rect(startX, y, 495, 22).fill(PDF_CONFIG.COLORS.GRAY[100]);
      doc.fillColor(PDF_CONFIG.COLORS.GRAY[700]).fontSize(PDF_CONFIG.FONTS.SMALL);
      doc.text("TANGGAL", startX + 10, y + 7);
      doc.text(showName ? "NAMA / KEPERLUAN" : "KEPERLUAN", startX + 90, y + 7);
      doc.text("TIPE", startX + 330, y + 7);
      doc.text("NOMINAL", startX + 400, y + 7, { width: 85, align: "right" });
    };

    drawHeader(currentY);
    currentY += 28;

    transactions.forEach((t, i) => {
      if (currentY > 750) {
        doc.addPage();
        currentY = 50;
        drawHeader(currentY);
        currentY += 28;
      }

      if (i % 2 === 0) doc.rect(startX, currentY - 5, 495, 22).fill(PDF_CONFIG.COLORS.GRAY[50]);

      doc.fillColor("black").fontSize(PDF_CONFIG.FONTS.SMALL);
      doc.text(this.formatDate(t.date), startX + 10, currentY);

      const mainInfo = showName ? `${t.santriName || t.vendorName || "-"} \n(${t.categoryName})` : t.categoryName;
      doc.text(mainInfo, startX + 90, currentY, { width: 230 });

      const isIncome = t.type === "income";
      doc.fillColor(isIncome ? PDF_CONFIG.COLORS.SUCCESS : PDF_CONFIG.COLORS.DANGER).text(isIncome ? "MASUK" : "KELUAR", startX + 330, currentY);

      doc.fillColor("black").text(this.formatIDR(t.amount), startX + 400, currentY, { width: 85, align: "right" });
      currentY += showName ? 30 : 22; 
    });
  }

 private static drawDocumentFooter(doc: PDFKit.PDFDocument): void {
  const pages = doc.bufferedPageRange();
   const footerY = PDF_CONFIG.PAGE.HEIGHT - 60; 
    const lineOffset = 6;
  
  const leftMargin = 50;
  const rightMargin = 50;
  const pageWidth = PDF_CONFIG.PAGE.WIDTH;
  const printableWidth = pageWidth - leftMargin - rightMargin;

  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    doc
      .moveTo(leftMargin, footerY - lineOffset)
      .lineTo(pageWidth - rightMargin, footerY - lineOffset)
      .strokeColor(PDF_CONFIG.COLORS.GRAY[200])
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(PDF_CONFIG.FONTS.CAPTION)
      .fillColor(PDF_CONFIG.COLORS.GRAY[500])
      .text(
        `Halaman ${i + 1} dari ${pages.count}`,
        leftMargin,
        footerY,
        {
          width: printableWidth,
          align: "left",
        }
      );

    doc
      .fontSize(PDF_CONFIG.FONTS.CAPTION)
      .fillColor(PDF_CONFIG.COLORS.GRAY[500])
      .text(
        `Dicetak pada ${this.formatDate(new Date)}`,
        leftMargin,
        footerY,
        {
          width: printableWidth,
          align: "right",
        }
      );
  }
}


  private static formatIDR(val: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  }
  private static formatDate(d: string | Date) {
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }
  private static getPurposeLabel(p: string) {
    return PURPOSE_LABELS[p] || p;
  }

  private static async createPdfDocument(drawCallback: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      drawCallback(doc);
      doc.end();
    });
  }
}
