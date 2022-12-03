import { ContactInMemoryRepository } from "../../modules/contact";
import { newHttpServer } from "../../modules/core/infrastructure/http/server";

export function main() {
  const contactRepo = new ContactInMemoryRepository();
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
