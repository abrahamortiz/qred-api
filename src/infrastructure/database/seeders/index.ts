import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { CompanySeeder } from "./company.seeder";
import { InvoiceSeeder } from "./invoice.seeder";
import { CardSeeder } from "./card.seeder";
import { TransactionSeeder } from "./transaction.seeder";

async function runSeeders() {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Database connection established");
    console.log("\nStarting database seeding...\n");

    // Run seeders in order (companies first, then dependent entities)
    const companySeeder = new CompanySeeder(AppDataSource);
    await companySeeder.run();

    const invoiceSeeder = new InvoiceSeeder(AppDataSource);
    await invoiceSeeder.run();

    const cardSeeder = new CardSeeder(AppDataSource);
    await cardSeeder.run();

    const transactionSeeder = new TransactionSeeder(AppDataSource);
    await transactionSeeder.run();

    console.log("\n✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Database connection closed");
    }
  }
}

// Run seeders if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders();
}

export { runSeeders };
