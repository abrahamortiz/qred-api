import { DataSource } from "typeorm";

export abstract class BaseSeeder {
  constructor(protected readonly dataSource: DataSource) {}

  abstract run(): Promise<void>;
}
