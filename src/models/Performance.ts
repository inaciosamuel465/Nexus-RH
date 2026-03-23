import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformance extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  evaluatorId: mongoose.Types.ObjectId;
  period: string;
  performanceScore: number;
  potentialScore: number;
  competencies: { name: string; score: number }[];
  goals: { title: string; progress: number }[];
  pdi: string;
  status: string;
  date: string;
}

const PerformanceSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  evaluatorId: { type: Schema.Types.ObjectId, ref: 'Employee' },
  period: { type: String, required: true },
  performanceScore: { type: Number, default: 0 },
  potentialScore: { type: Number, default: 0 },
  competencies: [{ name: String, score: Number }],
  goals: [{ title: String, progress: Number }],
  pdi: String,
  status: { type: String, default: 'Rascunho' },
  date: { type: String, required: true }
}, { timestamps: true });

export const PerformanceModel = mongoose.model<IPerformance>('Performance', PerformanceSchema);
