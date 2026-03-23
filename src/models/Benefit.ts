import mongoose, { Schema, Document } from 'mongoose';

export interface IBenefit extends Document {
  tenantId: string;
  name: string;
  provider: string;
  type: string;
  baseCost: number;
  eligibility: string;
  description?: string;
  active: boolean;
}

const BenefitSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  type: { type: String, required: true },
  baseCost: { type: Number, required: true },
  eligibility: { type: String, default: 'Todos' },
  description: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

export interface IEmployeeBenefit extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  benefitId: mongoose.Types.ObjectId;
  status: string;
  enrollmentDate: string;
  cardNumber?: string;
}

const EmployeeBenefitSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  benefitId: { type: Schema.Types.ObjectId, ref: 'Benefit', required: true },
  status: { type: String, default: 'Ativo' },
  enrollmentDate: { type: String, required: true },
  cardNumber: String
}, { timestamps: true });

export const BenefitModel = mongoose.model<IBenefit>('Benefit', BenefitSchema);
export const EmployeeBenefitModel = mongoose.model<IEmployeeBenefit>('EmployeeBenefit', EmployeeBenefitSchema);
