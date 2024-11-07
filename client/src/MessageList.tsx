import React, { FunctionComponent, useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";

import { Message, Socket } from "./socket";

export const MessageList: FunctionComponent = () => {
  const [items, setItems] = useState<Message[]>([]);

  const onMessage = useCallback(
    (message: Message) => {
      setItems((prev) => [message, ...prev]);
    },
    [setItems]
  );

  useEffect(() => {
    const id = Socket.get().subscribe(onMessage);
    return () => {
      Socket.get().unsubscribe(id);
    };
  }, [onMessage]);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div
            dangerouslySetInnerHTML={{
              __html: item.payload.body,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};
