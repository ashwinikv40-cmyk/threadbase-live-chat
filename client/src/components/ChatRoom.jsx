
import { useState } from "react";
import { useSocket } from "../hooks/useSocket.js";

export default function ChatRoom({ roomId = "thread-42" }) {
  const { messages, sendMessage } = useSocket(roomId);
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  }

  return (
    <div className="chat">
      <h2>Thread chat: {roomId}</h2>

      <ul className="messages">
        {messages.length === 0 && (
          <li className="empty">No messages yet. Say hello.</li>
        )}

        {messages.map((m) => (
          <li key={m.id}>
            <b>
              {typeof m.user === "object"
                ? m.user?.name ?? "Unknown"
                : m.user ?? "Unknown"}
              :
            </b>{" "}
            {m.text}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
