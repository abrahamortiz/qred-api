import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { Company } from "../entities/company.entity";

export class CompanySeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const companyRepository = this.dataSource.getRepository(Company);
    const existingCompanies = await companyRepository.count();

    if (existingCompanies > 0) {
      console.log("Companies already seeded, skipping...");
      return;
    }

    const companies = [
      {
        name: "Tech Innovators AB",
        logoUrl: "https://example.com/logos/tech-innovators.png",
      },
      {
        name: "Nordic Solutions Ltd",
        logoUrl: "https://example.com/logos/nordic-solutions.png",
      },
      {
        name: "Green Energy Group",
        logoUrl: "https://example.com/logos/green-energy.png",
      },
      {
        name: "Digital Marketing Pro",
        logoUrl: "https://example.com/logos/digital-marketing.png",
      },
      {
        name: "Retail Excellence AB",
        logoUrl: "https://example.com/logos/retail-excellence.png",
      },
    ];

    await companyRepository.save(companies);
    console.log(`Seeded ${companies.length} companies`);
  }
}
