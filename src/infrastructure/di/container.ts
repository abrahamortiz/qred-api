import { Container } from "inversify";
import { TYPES } from "./types";

// Repository interfaces
import { ICompanyRepository } from "@domain/repositories/company.repository";
import { IInvoiceRepository } from "@domain/repositories/invoice.repository";
import { ICardRepository } from "@domain/repositories/card.repository";
import { ITransactionRepository } from "@domain/repositories/transaction.repository";

// Repository implementations
import {
  CardRepository,
  CompanyRepository,
  InvoiceRepository,
  TransactionRepository,
} from "@infrastructure/database/repositories";

// Services
import { SpendingService } from "@domain/services/spending.service";
import { InvoiceService } from "@domain/services/invoice.service";

export const container = new Container();

// Register repositories
container
  .bind<ICompanyRepository>(TYPES.CompanyRepository)
  .to(CompanyRepository)
  .inSingletonScope();

container
  .bind<IInvoiceRepository>(TYPES.InvoiceRepository)
  .to(InvoiceRepository)
  .inSingletonScope();

container
  .bind<ICardRepository>(TYPES.CardRepository)
  .to(CardRepository)
  .inSingletonScope();

container
  .bind<ITransactionRepository>(TYPES.TransactionRepository)
  .to(TransactionRepository)
  .inSingletonScope();

// Register services
container
  .bind<SpendingService>(TYPES.SpendingService)
  .to(SpendingService)
  .inSingletonScope();

container
  .bind<InvoiceService>(TYPES.InvoiceService)
  .to(InvoiceService)
  .inSingletonScope();
