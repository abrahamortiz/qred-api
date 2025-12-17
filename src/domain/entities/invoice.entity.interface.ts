import { IBaseEntity } from "./base.entity.interface";
import { ICompany } from "./company.entity.interface";

export enum InvoiceStatus {
  DUE = "due",
  PAID = "paid",
  OVERDUE = "overdue",
}

export interface IInvoice extends IBaseEntity {
  companyId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: Date;
  company: ICompany;
}
