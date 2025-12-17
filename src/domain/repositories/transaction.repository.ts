import { ITransaction } from "@domain/entities/transaction.entity.interface";
import { BaseRepository } from "./base.repository";

export interface ITransactionRepository
  extends BaseRepository<ITransaction, string> {
  findByCardId(cardId: string): Promise<ITransaction[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]>;
}
