import mongoose, { Schema, Document } from "mongoose";

export type TimeSlot = { startTime: string; endTime: string };

export interface IClass extends Document {
  type: "single" | "recurring";
  name: string;
  description?: string;
  branchId: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
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
    byWeekday?: number[];
    timeSlotsByWeekday?: mongoose.Types.Map<TimeSlot[]>;
    byMonthDay?: number[];
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

const ClassSchema = new Schema<IClass>(
  {
    type: { type: String, enum: ["single", "recurring"], required: true },

    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
      index: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    durationMinutes: { type: Number, required: true },

    capacity: { type: Number, required: true },
    waitlistCapacity: { type: Number, default: 0 },
    allowDropIn: { type: Boolean, default: false },

    // Single
    startAt: { type: Date },
    endAt: { type: Date },

    // Recurring
    dtstart: { type: Date },
    until: { type: Date },

    recurrence: {
      freq: {
        type: String,
        enum: ["daily", "weekly", "monthly", "custom"],
      },
      interval: { type: Number },

      timeSlots: { type: [TimeSlotSchema] },

      byWeekday: { type: [Number] },
      timeSlotsByWeekday: {
        type: Map,
        of: [TimeSlotSchema],
      },

      byMonthDay: { type: [Number] },

      rrule: { type: String },
    },
  },
  { timestamps: true },
);

// Helpful indexes
ClassSchema.index({ branchId: 1, instructorId: 1 });
ClassSchema.index({ branchId: 1, roomId: 1 });

// Enforce clean field combinations
ClassSchema.pre("validate", function () {
  if (this.type === "single") {
    this.set("dtstart", undefined);
    this.set("until", undefined);
    this.set("recurrence", undefined);
  }

  if (this.type === "recurring") {
    this.set("startAt", undefined);
    this.set("endAt", undefined);
  }
});

export default mongoose.model<IClass>("Class", ClassSchema);
