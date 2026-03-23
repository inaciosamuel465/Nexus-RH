import mongoose, { Schema, Document } from 'mongoose';

export interface ITraining extends Document {
  tenantId: string;
  name: string;
  category: string;
  durationHours: number;
  description?: string;
  instructor: string;
  active: boolean;
  targetDepartments?: string[];
  isMandatory: boolean;
}

const TrainingSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  durationHours: { type: Number, required: true },
  description: String,
  instructor: { type: String, required: true },
  active: { type: Boolean, default: true },
  targetDepartments: [String],
  isMandatory: { type: Boolean, default: false }
}, { timestamps: true });

export interface IEmployeeTraining extends Document {
  tenantId: string;
  employeeId: mongoose.Types.ObjectId;
  trainingId: mongoose.Types.ObjectId;
  status: string;
  assignedBy: string;
  progress: number;
  assignedDate: string;
  completionDate?: string;
}

const EmployeeTrainingSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  trainingId: { type: Schema.Types.ObjectId, ref: 'Training', required: true },
  status: { type: String, default: 'Pendente' },
  assignedBy: { type: String, default: 'Sistema' },
  progress: { type: Number, default: 0 },
  assignedDate: { type: String, required: true },
  completionDate: String
}, { timestamps: true });

export const TrainingModel = mongoose.model<ITraining>('Training', TrainingSchema);
export const EmployeeTrainingModel = mongoose.model<IEmployeeTraining>('EmployeeTraining', EmployeeTrainingSchema);
