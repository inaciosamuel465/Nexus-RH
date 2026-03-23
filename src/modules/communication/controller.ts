import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { getIO } from '../../core/socket.js';
import { logger } from '../../core/logger.js';

export const sendInternalNotice = async (req: AuthRequest, res: Response) => {
  const { title, message } = req.body;
  const tenantId = req.user?.tenantId;

  try {
    const io = getIO();
    
    // Notifica todos na sala do Tenant via WebSockets
    io.to(`tenant_${tenantId}`).emit('internal_notice', {
      title,
      message,
      sender: req.user?.userId,
      timestamp: new Date()
    });

    logger.info(`Notícia Interna disparada para Tenant [${tenantId}]`);
    res.json({ success: true, message: 'Aviso enviado via Socket.io com sucesso.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const chatMessage = async (req: AuthRequest, res: Response) => {
  const { to, text } = req.body;
  const io = getIO();
  
  // Emissão direta de chat (P2P ou Grupo)
  io.to(`user_${to}`).emit('private_message', {
    from: req.user?.userId,
    text,
    at: new Date()
  });

  res.json({ success: true });
};
