import {
  IInvoice,
  InvoiceStatus,
} from "@domain/entities/invoice.entity.interface";
import { BaseRepository } from "./base.repository";

export interface IInvoiceRepository extends BaseRepository<IInvoice, string> {
  findByCompanyId(companyId: string): Promise<IInvoice[]>;
  findByStatus(status: InvoiceStatus): Promise<IInvoice[]>;
}
