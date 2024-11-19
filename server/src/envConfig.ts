import { config } from "dotenv";

export interface RedisConfig {
  port: number;
  hostName: string;
  messageQueueName: string;
}

export interface PostgresConfig {
  readonly url: string;
}

export class EnvConfig {
  public readonly port: number;
  public readonly hostName: string;

  public readonly redis: RedisConfig;
  public readonly pg: PostgresConfig;

  constructor() {
    config();

    this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    this.hostName = process.env.HOST_NAME ? process.env.HOST_NAME : "localhost";

    this.redis = {
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      hostName: process.env.REDIS_HOST_NAME ? process.env.REDIS_HOST_NAME : "localhost",
      messageQueueName: process.env.REDIS_MESSAGE_QUEUE_NAME ? process.env.REDIS_MESSAGE_QUEUE_NAME : "MESSAGES",
    }

    this.pg = {
      url:
        process.env.POSTGRES_URL ??
        "postgres://websocket:websocket@127.0.0.1:5432/websocket",
    };
  }
}