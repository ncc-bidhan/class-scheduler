import { z } from "zod";

/** Mongo ObjectId */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/** "HH:mm" 24h */
const hhmmSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

/** Basic timeslot */
const timeSlotSchema = z
  .object({
    startTime: hhmmSchema,
    endTime: hhmmSchema,
  })
  .superRefine((val, ctx) => {
    if (val.startTime >= val.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time must be before end time",
      });
    }
  });

/** Shared class fields */
const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),

  branchId: objectIdSchema,
  instructorId: objectIdSchema,
  roomId: objectIdSchema,

  timezone: z.string().min(1, "Timezone is required"),
  durationMinutes: z.number().int().min(1).max(1440),

  capacity: z.number().int().min(1),
  waitlistCapacity: z.number().int().min(0).default(0),
  allowDropIn: z.boolean().default(false),
});

/** Single (one-time) class: explicit startAt + endAt */
export const createSingleClassSchema = baseSchema
  .extend({
    type: z.literal("single"),
    startAt: z.string().datetime({ message: "Invalid startAt (ISO required)" }),
    endAt: z.string().datetime({ message: "Invalid endAt (ISO required)" }),
  })
  .superRefine((val, ctx) => {
    if (val.startAt >= val.endAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startAt"],
        message: "startAt must be before endAt",
      });
    }
  });

/** Recurrence schemas */
const dailyRecurrence = z.object({
  freq: z.literal("daily"),
  interval: z.number().int().min(1).default(1),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required"),
});

const weeklyRecurrence = z
  .object({
    freq: z.literal("weekly"),
    interval: z.number().int().min(1).default(1),
    byWeekday: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Select weekdays"),
    timeSlotsByWeekday: z
      .record(z.string(), z.array(timeSlotSchema))
      .refine(
        (obj) => Object.keys(obj).length > 0,
        "Time slots by weekday are required",
      ),
  })
  .superRefine((val, ctx) => {
    // Ensure keys are within selected weekdays
    const selected = new Set(val.byWeekday.map(String));
    for (const key of Object.keys(val.timeSlotsByWeekday)) {
      if (!selected.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeSlotsByWeekday", key],
          message: "Weekday has time slots but is not selected",
        });
      }
    }
  });

const monthlyRecurrence = z.object({
  freq: z.literal("monthly"),
  interval: z.number().int().min(1).default(1),
  byMonthDay: z
    .array(z.number().int().min(1).max(31))
    .min(1, "Select month dates"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required"),
});

const customRecurrence = z.object({
  freq: z.literal("custom"),
  // RRULE string is the cleanest way to support your “advanced looping logic”
  rrule: z.string().min(1, "RRULE is required"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required"),
});

export const createRecurringClassSchema = baseSchema
  .extend({
    type: z.literal("recurring"),
    dtstart: z.string().datetime({ message: "Invalid dtstart (ISO required)" }),
    until: z
      .string()
      .datetime({ message: "Invalid until (ISO required)" })
      .nullable()
      .optional(),
    recurrence: z.discriminatedUnion("freq", [
      dailyRecurrence,
      weeklyRecurrence,
      monthlyRecurrence,
      customRecurrence,
    ]),
  })
  .superRefine((val, ctx) => {
    if (val.until && val.dtstart >= val.until) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["until"],
        message: "until must be after dtstart",
      });
    }
  });

/** Occurrences query schema */
export const occurrencesQuerySchema = z
  .object({
    from: z.string().datetime({ message: "Invalid 'from' date format" }),
    to: z.string().datetime({ message: "Invalid 'to' date format" }),
    branchId: objectIdSchema.optional(),
    instructorId: objectIdSchema.optional(),
    roomId: objectIdSchema.optional(),
  })
  .superRefine((val, ctx) => {
    if (val.from >= val.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "'from' must be before 'to'",
      });
    }
  });
