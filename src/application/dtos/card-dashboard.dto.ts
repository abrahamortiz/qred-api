import { CardStatus } from "@domain/entities/card.entity.interface";

export interface CompanyDto {
  id: string;
  name: string;
  logoUrl: string;
}

export interface SpendingDto {
  limit: number;
  used: number;
  remaining: number;
  currency: string;
}

export interface CardDto {
  id: string;
  status: CardStatus;
  imageUrl: string;
  spending: SpendingDto;
}

export interface InvoiceDto {
  hasInvoiceDue: boolean;
  dueAmount: number;
  currency: string;
  dueDate: string | null;
}

export interface TransactionItemDto {
  id: string;
  amount: number;
  currency: string;
  date: string;
  merchant: string;
}

export interface TransactionsDto {
  items: TransactionItemDto[];
  totalCount: number;
}

export interface CardDashboardResponseDto {
  company: CompanyDto;
  card: CardDto;
  invoice: InvoiceDto;
  transactions: TransactionsDto;
}
