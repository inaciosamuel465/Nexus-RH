import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthRecord extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  type: string;
  date: string;
  status: string;
  nextExam: string;
  doctorName?: string;
  notes?: string;
}

const HealthRecordSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  nextExam: String,
  doctorName: String,
  notes: String
}, { timestamps: true });

export interface IMedicalCertificate extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  cid?: string;
  doctorName: string;
  crm: string;
  status: string;
  abonoHoras: boolean;
}

const MedicalCertificateSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  cid: String,
  doctorName: { type: String, required: true },
  crm: { type: String, required: true },
  status: { type: String, default: 'Pendente' },
  abonoHoras: { type: Boolean, default: false }
}, { timestamps: true });

export interface IEPIRecord extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  item: string;
  caNumber: string;
  deliveryDate: string;
  validityMonths: number;
  status: string;
}

const EPIRecordSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  item: { type: String, required: true },
  caNumber: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  validityMonths: { type: Number, required: true },
  status: { type: String, default: 'Entregue' }
}, { timestamps: true });

export const HealthRecordModel = mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);
export const MedicalCertificateModel = mongoose.model<IMedicalCertificate>('MedicalCertificate', MedicalCertificateSchema);
export const EPIRecordModel = mongoose.model<IEPIRecord>('EPIRecord', EPIRecordSchema);
