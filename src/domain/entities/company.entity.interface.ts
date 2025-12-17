import { IBaseEntity } from "./base.entity.interface";
import { IInvoice } from "./invoice.entity.interface";

export interface ICompany extends IBaseEntity {
  name: string;
  logoUrl: string;
  invoices: IInvoice[];
}
