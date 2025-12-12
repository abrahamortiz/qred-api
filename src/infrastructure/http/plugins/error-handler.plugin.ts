import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { BaseError } from "@shared/errors";
import { env } from "@infrastructure/config/env";

export async function errorHandlerPlugin(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send({
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const message = env.isDevelopment ? error.message : "Internal Server Error";

  request.log.error(error);

  return reply.status(statusCode).send({
    error: {
      message,
      statusCode,
      ...(env.isDevelopment && { stack: error.stack }),
    },
  });
}
