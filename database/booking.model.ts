import { Document, Types } from "mongoose";

export interface IBookinh extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
