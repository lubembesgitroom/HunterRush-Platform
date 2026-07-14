import { Server as HttpServer } from "node:http";

import {
  Server,
  Socket,
} from "socket.io";

export function createSocketServer(
  server: HttpServer,
): Server {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on(
    "connection",
    (socket: Socket) => {
      console.log(
        `🟢 ${socket.id} connected`,
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            `🔴 ${socket.id} disconnected`,
          );
        },
      );
    },
  );

  return io;
}