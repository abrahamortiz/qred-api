import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "@infrastructure/config/env";
import { Card } from "./entities/card.entity";
import { Company } from "./entities/company.entity";
import { Invoice } from "./entities/invoice.entity";
import { Transaction } from "./entities/transaction.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  synchronize: env.database.synchronize,
  logging: env.database.logging,
  entities: [Card, Company, Invoice, Transaction],
  migrations: [],
  subscribers: [],
});
