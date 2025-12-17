export const TYPES = {
  // Repositories
  CardRepository: Symbol.for("CardRepository"),
  CompanyRepository: Symbol.for("CompanyRepository"),
  InvoiceRepository: Symbol.for("InvoiceRepository"),
  TransactionRepository: Symbol.for("TransactionRepository"),

  // Services
  SpendingService: Symbol.for("SpendingService"),
  InvoiceService: Symbol.for("InvoiceService"),
} as const;
