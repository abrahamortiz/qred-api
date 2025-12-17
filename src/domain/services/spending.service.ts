import { injectable } from "inversify";
import { ICard } from "@domain/entities/card.entity.interface";
import { ITransaction } from "@domain/entities/transaction.entity.interface";

export interface SpendingCalculation {
  limit: number;
  used: number;
  remaining: number;
  currency: string;
}

@injectable()
export class SpendingService {
  calculateSpending(
    card: ICard,
    transactions: ITransaction[]
  ): SpendingCalculation {
    const totalSpent = (transactions || []).reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );

    const spendingLimit = Number(card.spendingLimit);
    const remainingLimit = spendingLimit - totalSpent;

    return {
      limit: spendingLimit,
      used: totalSpent,
      remaining: remainingLimit,
      currency: card.currency,
    };
  }
}
