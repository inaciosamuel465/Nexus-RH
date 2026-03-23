import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  tenantId: string;
  requesterId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  aiResolution?: string;
}

const TicketSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  priority: { type: String, enum: ['Baixa', 'Média', 'Alta'], default: 'Média' },
  status: { type: String, enum: ['Aberto', 'Em Andamento', 'Resolvido'], default: 'Aberto' },
  aiResolution: { type: String }
}, { timestamps: true });

export const TicketModel = mongoose.model<ITicket>('Ticket', TicketSchema);
