// Seed data untuk kategori
const defaultCategories = [
  // INCOME yang NAIKKAN deposit
  { name: "Setoran Tunai", type: "income", affectsDeposit: true, createsDebt: false },
  { name: "Transfer Bank", type: "income", affectsDeposit: true, createsDebt: false },
  { name: "Donasi", type: "income", affectsDeposit: true, createsDebt: false },
  
  // INCOME khusus (tidak naikkan deposit)
  { name: "Pembayaran Hutang", type: "income", affectsDeposit: false, isDebtPayment: true },
  
  // EXPENSE yang TURUNKAN deposit
  { name: "Makan", type: "expense", affectsDeposit: true, createsDebt: false },
  { name: "Transportasi", type: "expense", affectsDeposit: true, createsDebt: false },
  { name: "Buku", type: "expense", affectsDeposit: true, createsDebt: false },
  
  // EXPENSE khusus (bisa hutang)
  { name: "SPP", type: "expense", affectsDeposit: true, createsDebt: true }, // Bisa hutang jika deposit kurang
  { name: "Kursus", type: "expense", affectsDeposit: true, createsDebt: true },
];