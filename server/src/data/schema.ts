import { pgTable, jsonb, uuid, index } from "drizzle-orm/pg-core";

export const messagesTable = pgTable(
  "messages",
  {
    id: uuid().primaryKey().notNull(),
    groupID: uuid().notNull(),
    data: jsonb().notNull(),
  },
  (table) => {
    return {
      idIndex: index("messages_id_index").using("btree", table.id),
      groupIndex: index("messages_groupID_index").using("btree", table.groupID),
    };
  }
);
