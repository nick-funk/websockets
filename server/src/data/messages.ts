import Logger from "bunyan";
import { SqlContext } from "./sql";
import { messagesTable } from "./schema";

interface Message {
  id: string;
  groupID: string;
  data: any;
}

export class MessagesRepository {
  public sql: SqlContext;
  public logger: Logger;

  constructor(sql: SqlContext, logger: Logger) {
    this.sql = sql;
    this.logger = logger;
  }

  public async createMessage(message: Message) {
    const result = await this.sql.db.insert(messagesTable).values({
      id: message.id,
      groupID: message.groupID,
      data: message.data
    });

    return result.rowCount === 1 ? message : null;
  }
}