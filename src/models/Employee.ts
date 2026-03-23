import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  tenantId: string;
  userId: mongoose.Types.ObjectId;
  registration: string;
  name: string;
  role: string;
  department: string;
  sectorId?: mongoose.Types.ObjectId;
  contractType: string;
  userRole: string;
  salary: number;
  hireDate: string;
  status: string;
  email: string;
  managerId?: mongoose.Types.ObjectId;
  // Dados Pessoais
  cpf?: string;
  rg?: string;
  phone?: string;
  address?: { street: string; city: string; state: string; zip: string };
  birthDate?: string;
  // Dados Bancários
  bank?: { name: string; agency: string; account: string; pix?: string };
  // Dependentes
  dependents: { name: string; type: string; dob: string }[];
  // Histórico
  history: { date: string; event: string; role: string; salary: number }[];
  // Onboarding
  onboardingTasks?: { id: string; label: string; completed: boolean }[];
  onboardingCompleted?: boolean;
  // Métricas
  performanceScore: number;
  turnoverRisk?: number;
  vacationBalance: number;
  // Desligamento
  terminationDetails?: { date: string; reason: string; completed: boolean };
}

const EmployeeSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  registration: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  sectorId: { type: Schema.Types.ObjectId, ref: 'Sector' },
  contractType: { type: String, default: 'CLT' },
  userRole: { type: String, default: 'EMPLOYEE' },
  salary: { type: Number, required: true },
  hireDate: { type: String, required: true },
  status: { type: String, default: 'Ativo' },
  email: { type: String, required: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
  // Pessoais
  cpf: String,
  rg: String,
  phone: String,
  address: { street: String, city: String, state: String, zip: String },
  birthDate: String,
  // Bancários
  bank: { name: String, agency: String, account: String, pix: String },
  // Dependentes
  dependents: [{ name: String, type: String, dob: String }],
  // Histórico
  history: [{ date: String, event: String, role: String, salary: Number }],
  // Onboarding
  onboardingTasks: [{ id: String, label: String, completed: Boolean }],
  onboardingCompleted: { type: Boolean, default: false },
  // Métricas
  performanceScore: { type: Number, default: 0 },
  turnoverRisk: Number,
  vacationBalance: { type: Number, default: 30 },
  // Desligamento
  terminationDetails: { date: String, reason: String, completed: Boolean }
}, { timestamps: true });

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
