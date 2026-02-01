import mongoose, { Schema, Document } from "mongoose";

export interface IInstructor extends Document {
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  branchIds: mongoose.Types.ObjectId[];
}

const InstructorSchema = new Schema<IInstructor>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    bio: { type: String, trim: true, maxlength: 1000 },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    branchIds: [{ type: Schema.Types.ObjectId, ref: "Branch", index: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IInstructor>("Instructor", InstructorSchema);
