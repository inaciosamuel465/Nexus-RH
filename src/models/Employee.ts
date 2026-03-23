import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  tenantId: string;
  userId: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  history: any[];
  performanceScore: number;
  turnoverRisk?: number;
}

const EmployeeSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  sectorId: { type: Schema.Types.ObjectId, ref: 'Sector' },
  salary: { type: Number, required: true },
  history: { type: [Schema.Types.Mixed], default: [] },
  performanceScore: { type: Number, default: 0 },
  turnoverRisk: { type: Number }
}, { timestamps: true });

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
