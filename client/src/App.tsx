import React, { FunctionComponent, useCallback } from "react";

import { PostForm } from "./PostForm";
import { MessageList } from "./MessageList";
import { StaticConfig } from "./staticConfig";

export const App: FunctionComponent = () => {
  const onSubmit = useCallback(async (text: string) => {
    const url = StaticConfig.api("/post");
    await fetch(url, {
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
