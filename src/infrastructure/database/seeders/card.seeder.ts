import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { Card } from "../entities/card.entity";
import { Company } from "../entities/company.entity";
import { CardStatus } from "@domain/entities/card.entity.interface";

export class CardSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const cardRepository = this.dataSource.getRepository(Card);
    const companyRepository = this.dataSource.getRepository(Company);
    const existingCards = await cardRepository.count();

    if (existingCards > 0) {
      console.log("Cards already seeded, skipping...");
      return;
    }

    const companies = await companyRepository.find();

    if (companies.length === 0) {
      console.log("No companies found, skipping card seeding...");
      return;
    }

    const cards = [
      {
        companyId: companies[0].id,
        status: CardStatus.ACTIVE,
        spendingLimit: 100000,
        currency: "SEK",
        imageUrl: "https://example.com/cards/card-1.png",
      },
      {
        companyId: companies[1].id,
        status: CardStatus.ACTIVE,
        spendingLimit: 150000,
        currency: "SEK",
        imageUrl: "https://example.com/cards/card-2.png",
      },
      {
        companyId: companies[2].id,
        status: CardStatus.BLOCKED,
        spendingLimit: 80000,
        currency: "SEK",
        imageUrl: "https://example.com/cards/card-3.png",
      },
      {
        companyId: companies[3].id,
        status: CardStatus.ACTIVE,
        spendingLimit: 50000,
        currency: "SEK",
        imageUrl: "https://example.com/cards/card-4.png",
      },
      {
        companyId: companies[4].id,
        status: CardStatus.INACTIVE,
        spendingLimit: 200000,
        currency: "SEK",
        imageUrl: "https://example.com/cards/card-5.png",
      },
    ];

    await cardRepository.save(cards);
    console.log(`Seeded ${cards.length} cards`);
  }
}
