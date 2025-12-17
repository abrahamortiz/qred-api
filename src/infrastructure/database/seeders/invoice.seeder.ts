import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { Invoice } from "../entities/invoice.entity";
import { Company } from "../entities/company.entity";
import { InvoiceStatus } from "@domain/entities/invoice.entity.interface";

export class InvoiceSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const invoiceRepository = this.dataSource.getRepository(Invoice);
    const companyRepository = this.dataSource.getRepository(Company);
    const existingInvoices = await invoiceRepository.count();

    if (existingInvoices > 0) {
      console.log("Invoices already seeded, skipping...");
      return;
    }

    const companies = await companyRepository.find();

    if (companies.length === 0) {
      console.log("No companies found, skipping invoice seeding...");
      return;
    }

    const invoices = [
      {
        companyId: companies[0].id,
        amount: 15000,
        currency: "SEK",
        status: InvoiceStatus.PAID,
      },
      {
        companyId: companies[0].id,
        amount: 25000,
        currency: "SEK",
        status: InvoiceStatus.DUE,
      },
      {
        companyId: companies[1].id,
        amount: 35000,
        currency: "SEK",
        status: InvoiceStatus.PAID,
      },
      {
        companyId: companies[1].id,
        amount: 12000,
        currency: "SEK",
        status: InvoiceStatus.OVERDUE,
      },
      {
        companyId: companies[2].id,
        amount: 50000,
        currency: "SEK",
        status: InvoiceStatus.DUE,
      },
      {
        companyId: companies[2].id,
        amount: 18000,
        currency: "SEK",
        status: InvoiceStatus.PAID,
      },
      {
        companyId: companies[3].id,
        amount: 8000,
        currency: "SEK",
        status: InvoiceStatus.DUE,
      },
      {
        companyId: companies[4].id,
        amount: 42000,
        currency: "SEK",
        status: InvoiceStatus.OVERDUE,
      },
    ];

    await invoiceRepository.save(invoices);
    console.log(`Seeded ${invoices.length} invoices`);
  }
}
