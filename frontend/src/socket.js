// src/socket.js
import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.VITE_BACKEND_SOCKET_URL) {
    return import.meta.env.VITE_BACKEND_SOCKET_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  return "http://localhost:5001";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket"],
});

