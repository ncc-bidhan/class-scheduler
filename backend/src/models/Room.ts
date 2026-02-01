import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  branchId: mongoose.Types.ObjectId;
  capacity?: number;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    capacity: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
