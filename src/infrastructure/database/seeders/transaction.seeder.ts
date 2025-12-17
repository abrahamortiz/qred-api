import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { Transaction } from "../entities/transaction.entity";
import { Card } from "../entities/card.entity";
import { Invoice } from "../entities/invoice.entity";

export class TransactionSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const transactionRepository = this.dataSource.getRepository(Transaction);
    const cardRepository = this.dataSource.getRepository(Card);
    const invoiceRepository = this.dataSource.getRepository(Invoice);
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

    const invoices = await invoiceRepository.find();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Find invoices for each company to link transactions
    const getInvoiceForCompany = (companyId: string) => {
      return invoices.find((invoice) => invoice.companyId === companyId);
    };

    const invoice0 = getInvoiceForCompany(cards[0].companyId);
    const invoice1 = getInvoiceForCompany(cards[1].companyId);
    const invoice2 = getInvoiceForCompany(cards[2].companyId);
    const invoice3 = getInvoiceForCompany(cards[3].companyId);
    const invoice4 = getInvoiceForCompany(cards[4].companyId);

    const transactions = [
      {
        cardId: cards[0].id,
        invoiceId: invoice0?.id || null,
        merchant: "Amazon",
        amount: 1500,
        currency: "SEK",
        transactionDate: today,
      },
      {
        cardId: cards[0].id,
        invoiceId: invoice0?.id || null,
        merchant: "Uber",
        amount: 3200,
        currency: "SEK",
        transactionDate: yesterday,
      },
      {
        cardId: cards[0].id,
        invoiceId: null,
        merchant: "Starbucks",
        amount: 850,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[1].id,
        invoiceId: invoice1?.id || null,
        merchant: "Google Ads",
        amount: 4500,
        currency: "SEK",
        transactionDate: today,
      },
      {
        cardId: cards[1].id,
        invoiceId: invoice1?.id || null,
        merchant: "LinkedIn",
        amount: 2100,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[1].id,
        invoiceId: null,
        merchant: "Microsoft",
        amount: 8900,
        currency: "SEK",
        transactionDate: lastMonth,
      },
      {
        cardId: cards[2].id,
        invoiceId: invoice2?.id || null,
        merchant: "Spotify",
        amount: 1200,
        currency: "SEK",
        transactionDate: lastMonth,
      },
      {
        cardId: cards[3].id,
        invoiceId: invoice3?.id || null,
        merchant: "Taxi Stockholm",
        amount: 550,
        currency: "SEK",
        transactionDate: yesterday,
      },
      {
        cardId: cards[3].id,
        invoiceId: invoice3?.id || null,
        merchant: "Office Depot",
        amount: 2400,
        currency: "SEK",
        transactionDate: lastWeek,
      },
      {
        cardId: cards[4].id,
        invoiceId: invoice4?.id || null,
        merchant: "AWS",
        amount: 15000,
        currency: "SEK",
        transactionDate: lastMonth,
      },
    ];

    await transactionRepository.save(transactions);
    console.log(`Seeded ${transactions.length} transactions`);
  }
}
