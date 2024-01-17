import React, { useState, KeyboardEvent } from "react";

type Props = {
  chats: { sender: string; message: string }[];
  color: string;
  sendChat: (updateData: any) => void;
};

function Chat({ chats, color, sendChat }: Props) {
  const [msg, setMsg] = useState("");

  const submit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && msg.trim() !== "") {
      sendChat({
        chat: [...chats, { sender: color, message: msg }],
      });
      setMsg("");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {chats.map((chat, idx) => (
          <div key={`${idx}-${color}`}>{chat.message}</div>
        ))}
      </div>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => submit(e)}
        type="text"
      />
    </div>
  );
}

export default Chat;
