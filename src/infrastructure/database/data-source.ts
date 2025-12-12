import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "@infrastructure/config/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  synchronize: env.database.synchronize,
  logging: env.database.logging,
  entities: [],
  migrations: [],
  subscribers: [],
});
