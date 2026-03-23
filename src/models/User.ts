import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  tenantId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'LIDER' | 'COLABORADOR';
  managerId?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'LIDER', 'COLABORADOR'], default: 'COLABORADOR' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
