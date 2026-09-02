import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? "https://veyra-backend-reey.onrender.com"
    : "http://localhost:5000");

console.log("🔌 Socket URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  path: "/socket.io/",
  transports: ["polling", "websocket"],
});