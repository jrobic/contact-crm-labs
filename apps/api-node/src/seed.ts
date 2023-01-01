/* eslint-disable no-console */
/* c8 ignore start */
/* eslint-disable import/no-extraneous-dependencies */
import PromisePool from "@supercharge/promise-pool";
import { ContactPgRepository } from "./modules/contact/infrastructure/repository/contact-pg.repository";
import { ContactEntity, prisma } from "./modules/core";
import { newContactBuilder } from "./modules/core/domain/builder";

// eslint-disable-next-line no-unused-vars
async function dropData() {
  const excludeTables = ["spatial_ref_sys", "_prisma_migrations"];

  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  // eslint-disable-next-line no-restricted-syntax
  for (const { tablename } of tablenames) {
    if (!excludeTables.includes(tablename)) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
        console.log(`TRUNCATE ${tablename}`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
}

async function seed() {
  const pool = PromisePool.withConcurrency(20);

  const repo = new ContactPgRepository();

  // inject lots of contacts in the database
  const range = [...Array(5000).keys()];

  const { results: contacts } = await pool.for(range).process(async () => {
    const contact = ContactEntity.create(newContactBuilder());

    await repo.createContact(contact);
  });

  console.log("contacts created ", contacts.length);
}

async function main() {
  await dropData();

  await seed();

  console.log("Insert Data Successfully");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

/* c8 ignore end */
