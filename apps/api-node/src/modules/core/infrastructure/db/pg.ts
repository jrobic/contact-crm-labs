import { Pool } from "pg";

let pgClient: Pool;

export function getPGClient() {
  if (!pgClient) {
    pgClient = new Pool({
      connectionString: process.env.DATABASE_URL,
      idleTimeoutMillis: 5000,
      maxUses: 7500,
    });

    pgClient.connect();
  }

  return pgClient;
}

process.on("SIGTERM", async () => {
  // eslint-disable-next-line no-console
  console.log("[PG] kill active connection");
  if (pgClient) {
    await pgClient.end();
  }
});
