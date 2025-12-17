import { IBaseEntity } from "./base.entity.interface";
import { ICard } from "./card.entity.interface";
import { IInvoice } from "./invoice.entity.interface";

export interface ITransaction extends IBaseEntity {
  cardId: string;
  invoiceId: string | null;
  merchant: string;
  amount: number;
  currency: string;
  transactionDate: Date;
  card: ICard;
  invoice: IInvoice | null;
}
