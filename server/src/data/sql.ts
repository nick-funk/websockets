import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";

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