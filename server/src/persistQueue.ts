import { v4 as uuid } from "uuid";
import Redis from "ioredis";
import { RedisConfig } from "./envConfig";
import { Job, Queue, Worker } from "bullmq";
import { PostPayload } from "./main";
import { MessagesRepository } from "./data/messages";

export class PersistQueue {
  public readonly worker: Worker;
  public readonly connection: Redis;
  public readonly queue: Queue;

  private repository: MessagesRepository;
  private persistDelegate: (job: Job) => Promise<any>;

  constructor(config: RedisConfig, repository: MessagesRepository) {
    this.repository = repository;

    const opts = {
      connection: {
        host: config.hostName,
        port: config.port,
      },
    };

    this.connection = new Redis(config.port, config.hostName);
    this.queue = new Queue("messageProcessor", opts);

    this.persistDelegate = this.persistMessage.bind(this);

    this.worker = new Worker(
      "messageProcessor",
      this.persistDelegate,
      opts
    );
  }

  private async persistMessage(job: Job): Promise<any> {
    const data = job.data as PostPayload;
    if (!data) {
      return;
    }

    await this.repository.createMessage({
      id: uuid(),
      groupID: uuid(),
      data: {
        createdAt: new Date(),
        body: data.body,
      }
    });
  }

  public async save(payload: PostPayload) {
    return await this.queue.add("persistMessage", payload);
  }
}
