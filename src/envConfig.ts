import { config } from "dotenv";

export class EnvConfig {
  public readonly port: number;
  public readonly hostName: string;

  constructor() {
    config();

    this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    this.hostName = process.env.HOST_NAME ? process.env.HOST_NAME : "localhost";
  }
}