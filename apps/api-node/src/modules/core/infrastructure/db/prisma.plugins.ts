/* c8 ignore start */

import fp from "fastify-plugin";
import { FastifyPluginCallback } from "fastify";
import { prisma } from "./prisma";

const prismaPluginCb: FastifyPluginCallback = (fastify, opts, done) => {
  if (process.env.NODE_ENV !== "production") {
    prisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      // eslint-disable-next-line no-console
      fastify.log.debug(
        `Prisma: Query ${params.model}.${params.action} took ${
          after - before
        }ms`
      );
      return result;
    });
  }

  done();
};

export const prismaPlugin = fp(prismaPluginCb, {});

/* c8 ignore end */
