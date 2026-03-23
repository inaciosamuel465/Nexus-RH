import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  tenantId: string;
  name: string;
  email: string;
  appliedRole: string;
  cvSummary?: string;
  aiScore?: number;
  aiAnalysis?: any;
  status: 'Pendente' | 'Analisado' | 'Entrevista' | 'Reprovado';
}

const CandidateSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  appliedRole: { type: String, required: true },
  cvSummary: { type: String },
  aiScore: { type: Number, default: 0 },
  aiAnalysis: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['Pendente', 'Analisado', 'Entrevista', 'Reprovado'], default: 'Pendente' }
}, { timestamps: true });

export const CandidateModel = mongoose.model<ICandidate>('Candidate', CandidateSchema);
