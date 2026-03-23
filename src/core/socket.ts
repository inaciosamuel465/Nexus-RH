import { Server } from "socket.io";
import { logger } from "./logger.js";

let io: Server | null = null;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    logger.info(`Socket: Novo cliente conectado [${socket.id}]`);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io não foi inicializado.");
  }
  return io;
};

export const emitToTenant = (tenantId: string, event: string, data: any) => {
  if (io) {
    // Emite para uma "sala" específica do Tenant para isolamento SaaS
    io.to(`tenant_${tenantId}`).emit(event, data);
  }
};
