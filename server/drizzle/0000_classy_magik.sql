CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"groupID" uuid NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_id_index" ON "messages" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_groupID_index" ON "messages" USING btree ("groupID");