import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function setupSwagger(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Qred Card Dashboard API",
        description: "API for the Qred Card Dashboard mobile view (Case Study)",
        version: "1.0.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [{ name: "Companies", description: "Company related endpoints" }],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
  });
}
