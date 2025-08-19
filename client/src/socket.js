// src/socket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3003', {
  autoConnect: false,
});

export default socket;
