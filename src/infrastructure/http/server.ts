import Fastify, { FastifyInstance } from "fastify";
import { env } from "@infrastructure/config/env";
import { AppDataSource } from "@infrastructure/database/data-source";
import { errorHandlerPlugin } from "./plugins/error-handler.plugin";
import { companyRoutes } from "./routes/company.routes";
import { setupSwagger } from "./plugins/swagger.plugin";

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

  private async setupSwagger(): Promise<void> {
    await setupSwagger(this.app);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      this.app.log.info("Database connection established");
    } catch (error) {
      this.app.log.error(error, "Error connecting to database");
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

    await this.app.register(companyRoutes, { prefix: "/api" });
  }

  public async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.setupSwagger();
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
