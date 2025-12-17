import { injectable } from "inversify";
import { ITransactionRepository } from "@domain/repositories/transaction.repository";
import { ITransaction } from "@domain/entities/transaction.entity.interface";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { Between, Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import { AppDataSource } from "../data-source";

@injectable()
export class TransactionRepository
  extends BaseRepositoryImpl<ITransaction, string>
  implements ITransactionRepository
{
  constructor() {
    super(AppDataSource.getRepository(Transaction) as Repository<ITransaction>);
  }

  async findByCardId(cardId: string): Promise<ITransaction[]> {
    return this.repository.find({ where: { cardId } });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ITransaction[]> {
    return this.repository.find({
      where: {
        transactionDate: Between(startDate, endDate),
      },
    });
  }
}
