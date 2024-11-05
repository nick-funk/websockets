import express from "express";
import bunyan from "bunyan";

import { EnvConfig } from "./envConfig";

const run = async () => {
  const log = bunyan.createLogger({ name: "websockets" });
  const env = new EnvConfig();

  const app = express();

  app.listen(env.port, env.hostName, () => {
    log.info({ port: env.port, host: env.hostName }, "server is listening");
  });
};

run();