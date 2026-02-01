import mongoose, { Schema, Document } from "mongoose";

type TimeSlot = { startTime: string; endTime: string };

export interface IClass extends Document {
  type: "single" | "recurring";
  name: string;
  description?: string;
  branchId: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  timezone: string;
  durationMinutes: number;
  capacity: number;
  waitlistCapacity: number;
  allowDropIn: boolean;

  // Single class fields
  startAt?: Date;
  endAt?: Date;

  // Recurring class fields
  dtstart?: Date;
  until?: Date | null;
  recurrence?: {
    freq: "daily" | "weekly" | "monthly" | "custom";
    interval?: number;

    // daily/monthly/custom
    timeSlots?: TimeSlot[];

    // weekly
    byWeekday?: number[]; // 0..6
    timeSlotsByWeekday?: Map<string, TimeSlot[]>; // key: "0".."6"

    // monthly
    byMonthDay?: number[]; // 1..31

    // custom
    rrule?: string;
  };
}

const TimeSlotSchema = new Schema<TimeSlot>(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

const ClassSchema: Schema = new Schema(
  {
    type: { type: String, enum: ["single", "recurring"], required: true },

    name: { type: String, required: true },
    description: { type: String },

    branchId: { type: Schema.Types.ObjectId, required: true, index: true },
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, required: true, index: true },

    timezone: { type: String, required: true },
    durationMinutes: { type: Number, required: true },

    capacity: { type: Number, required: true },
    waitlistCapacity: { type: Number, default: 0 },
    allowDropIn: { type: Boolean, default: false },

    // Single
    startAt: { type: Date, index: true },
    endAt: { type: Date },

    // Recurring
    dtstart: { type: Date, index: true },
    until: { type: Date, default: null },

    recurrence: {
      freq: { type: String, enum: ["daily", "weekly", "monthly", "custom"] },
      interval: { type: Number, default: 1 },

      timeSlots: { type: [TimeSlotSchema], default: undefined },

      byWeekday: { type: [Number], default: undefined },
      timeSlotsByWeekday: {
        type: Map,
        of: [TimeSlotSchema],
        default: undefined,
      },

      byMonthDay: { type: [Number], default: undefined },

      rrule: { type: String, default: undefined },
    },
  },
  { timestamps: true },
);

// Helpful indexes for later conflict + fetching
ClassSchema.index({ branchId: 1, instructorId: 1 });
ClassSchema.index({ branchId: 1, roomId: 1 });

export default mongoose.model<IClass>("Class", ClassSchema);
