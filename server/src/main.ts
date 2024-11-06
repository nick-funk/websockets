import cors from "cors";
import express from "express";
import bunyan from "bunyan";
import joi from "joi";
import nunjucks from "nunjucks";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

import { EnvConfig } from "./envConfig";
import { MessageQueue, QueueMessage } from "./messageQueue";

const PostPayloadSchema = joi.object({
  body: joi.string().required(),
});

interface PostPayload {
  body: string;
}

interface SocketClient {
  id: string;
  ws: WebSocket;
}

const run = async () => {
  const log = bunyan.createLogger({ name: "websockets" });
  const env = new EnvConfig();

  const clients = new Map<string, SocketClient>();

  const queue = new MessageQueue(
    log,
    env.redis.hostName,
    env.redis.port,
    env.redis.messageQueueName
  );
  queue.subscribe("msg", (message: QueueMessage) => {
    for (const id of clients.keys()) {
      const client = clients.get(id);
      if (!client) {
        return;
      }

      client.ws.send(JSON.stringify(message));
    }
  });

  const wss = new WebSocketServer({
    port: env.wsPort,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024,
      },
      // Defaults to negotiated value
      clientNoContextTakeover: true,
      // Defaults to negotiated value
      serverNoContextTakeover: true,
      // Defaults to negotiated value
      serverMaxWindowBits: 10,
      // Limits zlib concurrency for perf
      concurrencyLimit: 10,

      // Size (in bytes) below which messages should not be
      // compressed if context takeover is disabled
      threshold: 1024,
    },
  });

  wss.on("connection", (ws: WebSocket) => {
    const client: SocketClient = {
      id: uuid(),
      ws,
    };

    clients.set(client.id, client);

    ws.on("message", (data: WebSocket.RawData) => {
      log.info(data, "received data");
    });

    ws.on("close", () => {
      clients.delete(client.id);
    });
  });

  nunjucks.configure("src/templates", { autoescape: true });

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send(nunjucks.render("index.html", {}));
  });

  app.use("/static", express.static("../client/dist"));

  app.post("/post", async (req, res) => {
    const result = PostPayloadSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
      return;
    }

    const post: PostPayload = result.value as PostPayload;
    if (!post) {
      res.sendStatus(400);
      return;
    }

    const sendResult = await queue.publish({
      type: "msg",
      payload: post,
    });

    res.status(200).send({
      success: !!sendResult,
      payload: sendResult?.payload,
    });
  });

  app.listen(env.port, env.hostName, () => {
    log.info({ port: env.port, host: env.hostName }, "server is listening");
  });
};

run();
