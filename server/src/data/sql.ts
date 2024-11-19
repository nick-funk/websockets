import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";

import { exec } from "child_process";
import { promisify } from "util";

const run = promisify(exec);

export class SqlContext {
  private url: string;

  public readonly db: NodePgDatabase<Record<string, never>> & {
    $client: NodePgClient;
  };
  public readonly client: NodePgClient;

  constructor(url: string) {
    this.url = url;

    this.db = drizzle(this.url); 
    this.client = this.db.$client;
  }
}

export const runMigrations = async () => {
  const { stderr } = await run("npm run drizzle:apply");
  if (stderr) {
    throw new Error(stderr);
  }
}