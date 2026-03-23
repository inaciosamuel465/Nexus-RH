import mongoose, { Schema, Document } from 'mongoose';

export interface ISector extends Document {
  tenantId: string;
  name: string;
  leaderId: mongoose.Types.ObjectId;
  trainings: string[];
  productivity: number;
  bestEmployeeId?: mongoose.Types.ObjectId;
}

const SectorSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainings: { type: [String], default: [] },
  productivity: { type: Number, default: 0 },
  bestEmployeeId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const SectorModel = mongoose.model<ISector>('Sector', SectorSchema);
