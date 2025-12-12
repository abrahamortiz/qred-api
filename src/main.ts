import { Server } from "./infrastructure/http/server";

const server = new Server();

server.start();

process.on("SIGINT", async (): Promise<never> => {
  await server.stop();
  process.exit(0);
});

process.on("SIGTERM", async (): Promise<never> => {
  await server.stop();
  process.exit(0);
});
