import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { skillService } from '../../services/SkillService.js';
import { TicketModel } from '../../models/Ticket.js';
import { logger } from '../../core/logger.js';

export const createTicket = async (req: AuthRequest, res: Response) => {
  const { subject, description } = req.body;
  const tenantId = req.user?.tenantId;

  try {
    const ticket = new TicketModel({
      tenantId,
      requesterId: req.user?.userId,
      subject,
      description
    });

    // IA resolve/analisa o ticket no ato da criação
    const result = await skillService.runSkill('supportTicket', {
      subject,
      description
    });

    ticket.aiResolution = result.aiResolution;
    ticket.priority = result.priority;
    ticket.category = result.category;
    
    await ticket.save();

    res.json({ 
      success: true, 
      message: 'Ticket aberto e analisado pela IA.',
      ticket 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await TicketModel.find({ tenantId: req.user?.tenantId });
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
