import React, { FunctionComponent, useCallback } from "react";

import { PostForm } from "./PostForm";
import { MessageList } from "./MessageList";

export const App: FunctionComponent = () => {
  const onSubmit = useCallback(async (text: string) => {
    await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: text,
      })
    });
  }, []);

  return <div>
    <PostForm onSubmit={onSubmit} />
    <MessageList />
  </div>;
};
