import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { Transaction } from "../entities/transaction.entity";
import { Card } from "../entities/card.entity";

export class TransactionSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const transactionRepository = this.dataSource.getRepository(Transaction);
    const cardRepository = this.dataSource.getRepository(Card);
    const existingTransactions = await transactionRepository.count();

    if (existingTransactions > 0) {
      console.log("Transactions already seeded, skipping...");
      return;
    }

    const cards = await cardRepository.find();

    if (cards.length === 0) {
      console.log("No cards found, skipping transaction seeding...");
      return;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const transactions = [
      {
        cardId: cards[0].id,
        amount: 1500,
        currency: "SEK",
        transactionDate: today,
      },
      {
        cardId: cards[0].id,
        amount: 3200,
        currency: "SEK",
        transactionDate: yesterday,
      },
      {
        cardId: cards[0].id,
        amount: 850,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[1].id,
        amount: 4500,
        currency: "SEK",
        transactionDate: today,
      },
      {
        cardId: cards[1].id,
        amount: 2100,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[1].id,
        amount: 8900,
        currency: "SEK",
        transactionDate: lastMonth,
      },
      {
        cardId: cards[2].id,
        amount: 1200,
        currency: "SEK",
        transactionDate: lastMonth,
      },
      {
        cardId: cards[3].id,
        amount: 550,
        currency: "SEK",
        transactionDate: yesterday,
      },
      {
        cardId: cards[3].id,
        amount: 2400,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[4].id,
        amount: 15000,
        currency: "SEK",
        transactionDate: lastMonth,
      },
    ];

    await transactionRepository.save(transactions);
    console.log(`Seeded ${transactions.length} transactions`);
  }
}
