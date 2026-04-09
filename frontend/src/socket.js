// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.BACKEND_SOCKET_URL || "http://localhost:5001";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});


