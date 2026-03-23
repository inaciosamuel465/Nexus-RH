import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunicationPost extends Document {
  tenantId: string;
  authorId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetDepartments: string[];
  targetRoles: string[];
  reactions: Record<string, string[]>;
  comments: { authorId: string; content: string; createdAt: string }[];
  published: boolean;
}

const CommunicationPostSchema: Schema = new Schema({
  tenantId: { type: String, required: true, index: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: String,
  targetDepartments: [String],
  targetRoles: [String],
  reactions: { type: Schema.Types.Mixed, default: { like: [], aplauso: [], star: [], coração: [] } },
  comments: [{ authorId: String, content: String, createdAt: String }],
  published: { type: Boolean, default: true }
}, { timestamps: true });

export const CommunicationPostModel = mongoose.model<ICommunicationPost>('CommunicationPost', CommunicationPostSchema);
