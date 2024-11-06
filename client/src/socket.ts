import { v4 as uuid } from "uuid";

export interface Message {
  type: string;
  payload: {
    body: string;
  }
}

export class Socket {
  private static _instance: Socket;

  private onMessageDelegate: (event: MessageEvent<any>) => void;

  private listeners: Map<string, (message: Message) => void>;

  private constructor() {
    this.onMessageDelegate = this.onMessage.bind(this);
    this.listeners = new Map<string, (message: Message) => void>();

    const socket = new WebSocket("/messages");
    socket.addEventListener("message", this.onMessageDelegate);
  }

  private onMessage(event: MessageEvent<any>) {
    const message = JSON.parse(event.data) as Message;
    if (!message) {
      return;
    }

    for (const id of this.listeners.keys()) {
      const listener = this.listeners.get(id);
      if (!listener) {
        continue;
      }

      listener(message);
    }
  }

  public subscribe(callback: (message: Message) => void) {
    const id = uuid();
    this.listeners.set(id, callback);

    return id;
  }

  public unsubscribe(id: string) {
    this.listeners.delete(id);
  }

  public static get() {
    if (!this._instance) {
      this._instance = new Socket();
    }

    return this._instance;
  }
}