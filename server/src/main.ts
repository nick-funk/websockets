import cors from "cors";
import express from "express";
import bunyan from "bunyan";
import joi from "joi";
import nunjucks from "nunjucks";

import { EnvConfig } from "./envConfig";
import { MessageQueue, QueueMessage } from "./messageQueue";

const PostPayloadSchema = joi.object({
  body: joi.string().required(),
});

interface PostPayload {
  body: string;
}

const run = async () => {
  const log = bunyan.createLogger({ name: "websockets" });
  const env = new EnvConfig();

  const queue = new MessageQueue(log, env.redis.hostName, env.redis.port, env.redis.messageQueueName);
  queue.subscribe("msg", (message: QueueMessage) => {
    log.info(message, "received message");
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