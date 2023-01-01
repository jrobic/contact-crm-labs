import fastify, { FastifyServerOptions } from "fastify";
import { newContactController, ContactRepository } from "../../../contact";
import { DomainError } from "../../domain";
import { ApiResponse } from "../../../contact/infrastructure/http/dto";
import { prismaPlugin } from "../db/prisma.plugins";

const environment =
  process.env.TEST === "true" ? "test" : process.env.NODE_ENV || "development";

const envToLogger: Record<string, FastifyServerOptions["logger"]> = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: true,
        ignore: "pid,hostname",
        hideObject: false,
        singleLine: false,
      },
    },
  },
  production: {
    redact: ["headers.authorization"],
    name: "@cclabs-api-node",
  },
  test: false,
};

export function newHttpServer(repo: ContactRepository) {
  const app = fastify({
    logger: envToLogger[environment] ?? true,
  });

  app.register(prismaPlugin);

  const contactController = newContactController(repo);
  contactController.register(app);

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    if (error instanceof DomainError) {
      return reply
        .status(404)
        .send(ApiResponse.error(404, null, error.message));
    }

    return reply.status(500).send(ApiResponse.error(500, null, error.message));
  });

  return app;
}
