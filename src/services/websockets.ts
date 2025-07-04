import { Server } from "socket.io";
import logger from "../utils/logger";
import { Server as HttpServer } from "http";

export const setupWebsockets = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    logger.info(`🟢 Socket ${socket.id} connected`);

    socket.on("join-chat", ({ chatId, userId }) => {
      socket.join(chatId);
      socket.emit("joined-room", { chatId });
      logger.info(
        `🔌 Socket ${socket.id} user: ${userId} joined chat ${chatId}`
      );
    });

    socket.on("typing", ({ chatId, isAITyping }) => {
      logger.info(`🤖 AI is typing in chat ${chatId}: ${isAITyping}`);
      socket.to(chatId).emit("typing", { isAITyping });
    });

    socket.on("user-typing", ({ chatId, isUserTyping, userId }) => {
      logger.info(
        `👤 User ${userId} is typing in chat ${chatId}: ${isUserTyping}`
      );
      logger.info(
        `📡 Room ${chatId} has ${
          Array.from(io.sockets.adapter.rooms.get(chatId) || []).length
        } sockets`
      );
      logger.info(`🔄 Broadcasting to all OTHER sockets in room`);
      socket.to(chatId).emit("user-typing", { isUserTyping, userId });
    });

    socket.on("disconnect", (reason) => {
      logger.info(`❌ Socket ${socket.id} disconnected: ${reason}`);
    });
  });
};
