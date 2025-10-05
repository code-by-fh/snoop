import http from 'http';
import { Server as SocketIO } from 'socket.io';
import { setupSocket } from './SocketHandler.js';

export const setupSocketServer = async () => {
  console.log('Setting up SocketServer...');

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running');
  });

  const io = new SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  setupSocket(io);

  await new Promise((resolve) => {
    server.listen(8888, () => {
      console.log(`SocketServer is listening on port 8888`);
      resolve();
    });
  });

  return { server, io };
};
