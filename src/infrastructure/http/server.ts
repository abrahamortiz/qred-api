import Fastify, { FastifyInstance } from "fastify";
import { env } from "@infrastructure/config/env";
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

  public async registerRoutes(): Promise<void> {
    await this.app.register(
      async (instance) => {
        instance.get("/health", async () => {
          return { status: "ok", timestamp: new Date().toISOString() };
        });
      },
      { prefix: "/api" }
    );
  }

  public async start(): Promise<void> {
    try {
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
    await this.app.close();
  }

  public getApp(): FastifyInstance {
    return this.app;
  }
}
