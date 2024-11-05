import Logger from "bunyan";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";

export interface QueueMessage {
  type: string;
  payload: any;
}

export interface Subscription {
  id: string;
  type: string;
  callback: (message: QueueMessage) => void;
}

export class MessageQueue {
  private subscriber: Redis;
  private publisher: Redis;

  private queueName: string;
  private log: Logger;

  private typeMap: Map<string, Subscription[]>;

  constructor(log: Logger, hostName: string, port: number, queueName: string) {
    this.queueName = queueName;
    this.log = log.child({ queueName });

    this.typeMap = new Map<string, Subscription[]>();

    this.subscriber = new Redis(port, hostName);
    this.publisher = new Redis(port, hostName);

    this.subscriber.subscribe(this.queueName);
    this.subscriber.on("message", (channel: string, message: string) => {
      if (this.queueName !== channel) {
        return;
      }

      try {
        const data = JSON.parse(message) as QueueMessage;
        if (!data) {
          this.log.warn({ channel, message }, "unable to parse message json");
          return;
        }

        const subscribers = this.typeMap.get(data.type);
        if (!subscribers || subscribers.length === 0) {
          return;
        }

        for (const sub of subscribers) {
          sub.callback(data);
        }
      } catch {
        this.log.warn({ channel, message }, "an error occurred notifying from channel message");
      }
    });
  }

  public async publish(message: QueueMessage) {
    const data = JSON.stringify(message);
    const result = await this.publisher.publish(this.queueName, data);

    return result === 1 ? message : null;
  }

  public subscribe(type: string, callback: (message: QueueMessage) => void) {
    if (!this.typeMap.has(type)) {
      this.typeMap.set(type, []);
    }

    const subscription: Subscription = {
      id: uuid(),
      type,
      callback,
    };

    this.typeMap.get(type)!.push(subscription);
  }
}