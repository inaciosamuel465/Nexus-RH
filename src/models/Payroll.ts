import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  month: string;
  grossSalary: number;
  netSalary: number;
  events: { name: string; type: string; value: number; origin: string; reference?: string }[];
  totalDeductions: number;
  totalEarnings: number;
  fgtsValue: number;
  status: string;
}

const PayrollSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  grossSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  events: [{ name: String, type: String, value: Number, origin: String, reference: String }],
  totalDeductions: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  fgtsValue: { type: Number, default: 0 },
  status: { type: String, default: 'Aberto' }
}, { timestamps: true });

export const PayrollModel = mongoose.model<IPayroll>('Payroll', PayrollSchema);
