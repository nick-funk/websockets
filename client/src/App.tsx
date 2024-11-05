import React, { FunctionComponent, useCallback } from "react";

import { PostForm } from "./PostForm";

export const App: FunctionComponent = () => {
  const onSubmit = useCallback(async (text: string) => {
    await fetch("http://localhost:3000/post", {
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
  </div>;
};
