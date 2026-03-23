import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeRecord extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  date: string;
  type: string;
  timestamp: string;
  status: string;
  location?: string;
  justification?: string;
  managerNotes?: string;
}

const TimeRecordSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, default: 'Original' },
  location: String,
  justification: String,
  managerNotes: String
}, { timestamps: true });

export const TimeRecordModel = mongoose.model<ITimeRecord>('TimeRecord', TimeRecordSchema);
