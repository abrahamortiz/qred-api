import Fastify, { FastifyInstance } from "fastify";
import { env } from "@infrastructure/config/env";
import { AppDataSource } from "@infrastructure/database/data-source";
import { errorHandlerPlugin } from "./plugins/error-handler.plugin";

export class Server {
  private app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      logger: env.isDevelopment
        ? {
            level: "info",
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            },
          }
        : {
            level: "error",
          },
    });

    this.setupErrorHandler();
  }

  private setupErrorHandler(): void {
    this.app.setErrorHandler(errorHandlerPlugin);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      this.app.log.info("Database connection established");
    } catch (error) {
      this.app.log.error("Error connecting to database:", error);
      throw error;
    }
  }

  public async registerRoutes(): Promise<void> {
    await this.app.register(
      async (instance) => {
        instance.get("/health", async () => {
          return { status: "ok", timestamp: new Date().toISOString() };
        });
      },
      { prefix: "/api" },
    );
  }

  public async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.registerRoutes();

      await this.app.listen({
        port: env.port,
        host: env.host,
      });
    } catch (error) {
      this.app.log.error(error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      this.app.log.info("Database connection closed");
    }

    await this.app.close();
  }

  public getApp(): FastifyInstance {
    return this.app;
  }
}
