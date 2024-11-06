import React, { FunctionComponent } from "react";
import { useCallback } from "react";
import { useState } from "react";

interface Message {
  type: string;
  payload: {
    body: string;
  }
}

export const MessageList: FunctionComponent = () => {
  const [items, setItems] = useState<Message[]>([]);

  const onMessage = useCallback((event: MessageEvent<any>) => {
    const data = JSON.parse(event.data) as Message;
    if (!data) {
      return;
    }

    setItems([data, ...items]);
  }, [setItems, items]);

  const socket = new WebSocket("ws://localhost:3001");
  socket.addEventListener("message", onMessage);

  return <div>
    {items.map((item, index) => <div key={index}>{item.payload.body}</div>)}
  </div>
}