
// Task: npm install socket.io-client, then:  import { io } from "socket.io-client";

// TODO (Tasks 3-4): implement the live socket connection.
//
// export function useSocket(roomId) {
//   const { token } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//
//   useEffect(() => {
//     if (!token) return;
//     const s = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } }); // token -> handshake.auth.token
//     setSocket(s);
//     s.emit("room:join", roomId);
//     const onMessage = (msg) => setMessages((prev) => [...prev, msg]);
//     s.on("chat:message", onMessage);
//     return () => {
//       s.off("chat:message", onMessage);   // remove THIS listener
//       s.disconnect();                     // close the connection
//     };
//   }, [token, roomId]);
//
//   const sendMessage = useCallback(
//     (text) => socket?.emit("chat:message", { roomId, text }),
//     [socket, roomId]
//   );
//
//   return { messages, sendMessage };
// }

// Placeholder so the app runs before you implement the hook.
// Replace this whole function with the real implementation above.

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSocket(roomId) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    setSocket(s);

    const onMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    s.on("chat:message", onMessage);
    s.emit("room:join", roomId);

    return () => {
      s.off("chat:message", onMessage);
      s.disconnect();
      setSocket((current) => (current === s ? null : current));
    };
  }, [token, roomId]);

  const sendMessage = useCallback(
    (text) => {
      if (typeof text !== "string" || !text.trim()) return;

      socket?.emit("chat:message", {
        roomId,
        text: text.trim(),
      });
    },
    [socket, roomId]
  );

  return { messages, sendMessage };
}

