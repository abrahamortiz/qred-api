import { Client } from "pg";

const createDatabase = async (): Promise<void> => {
  const dbName = process.env.DB_NAME || "qred";

  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: "postgres",
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully`);
    } else {
      console.log(`ℹ️  Database "${dbName}" already exists`);
    }
  } catch (error) {
    console.error("❌ Error creating database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

createDatabase();
