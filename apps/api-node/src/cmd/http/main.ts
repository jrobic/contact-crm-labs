/* eslint-disable import/first */
// eslint-disable-next-line import/order
import { registerTracing } from "../../modules/core/infrastructure/http/otel";

// need to be loaded before any other import
registerTracing();

import { ContactPrismaRepository } from "../../modules/contact/infrastructure/repository/contact-prisma.repository";
import { newHttpServer } from "../../modules/core/infrastructure/http/server";
import { ContactPGRepository } from "../../modules/contact/infrastructure/repository/contact-pg.repository";

export function main() {
  // const contactRepo = new ContactInMemoryRepository();
  const contactRepo = new ContactPGRepository();
  // const contactRepo = new ContactPrismaRepository();
  const app = newHttpServer(contactRepo);

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
    app.log.info(`Server is now listening on ${address}`);
  });
}

main();
