import mongoose, { Schema, Document } from 'mongoose';

export interface IVacation extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  type: string;
  sellTenDays: boolean;
  requestDate: string;
}

const VacationSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, required: true },
  status: { type: String, default: 'Pendente' },
  type: { type: String, default: 'Individual' },
  sellTenDays: { type: Boolean, default: false },
  requestDate: { type: String, required: true }
}, { timestamps: true });

export const VacationModel = mongoose.model<IVacation>('Vacation', VacationSchema);
