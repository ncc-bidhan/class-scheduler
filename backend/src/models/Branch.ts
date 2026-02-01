import mongoose, { Schema, Document } from "mongoose";

export interface IBranch extends Document {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  timezone: string;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, trim: true, maxlength: 200 },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    timezone: { type: String, required: true, default: "UTC" },
  },
  { timestamps: true }
);

export default mongoose.model<IBranch>("Branch", BranchSchema);
