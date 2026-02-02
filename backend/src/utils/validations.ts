import { z } from "zod";

const objectIdSchema = z
  .string()
  .length(24, "Invalid ID format")
  .regex(/^[0-9a-fA-F]+$/, "Invalid ID format");

const hhmmSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

const uniqueTimeSlots = (slots: { startTime: string; endTime: string }[]) =>
  new Set(slots.map((s) => `${s.startTime}-${s.endTime}`)).size ===
  slots.length;

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

const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),

  branchId: objectIdSchema,
  instructorId: objectIdSchema,
  roomId: objectIdSchema,

  durationMinutes: z.number().int().min(1).max(1440),

  capacity: z.number().int().min(1),
  waitlistCapacity: z.number().int().min(0).default(0),
  allowDropIn: z.boolean().default(false),
});

export const createSingleClassSchema = baseSchema
  .extend({
    type: z.literal("single"),
    startAt: z
      .string()
      .datetime({ offset: true, message: "Invalid startAt (ISO required)" }),
    endAt: z
      .string()
      .datetime({ offset: true, message: "Invalid endAt (ISO required)" }),
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

const dailyRecurrence = z.object({
  freq: z.literal("daily"),
  interval: z.number().int().min(1).default(1),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .refine(uniqueTimeSlots, "Duplicate time slots are not allowed"),
});

const weeklyRecurrence = z
  .object({
    freq: z.literal("weekly"),
    interval: z.number().int().min(1).default(1),
    byWeekday: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Select weekdays"),
    timeSlotsByWeekday: z
      .record(
        z.string().regex(/^[0-6]$/, "Weekday key must be 0-6"),
        z.array(timeSlotSchema),
      )
      .refine(
        (obj) => Object.keys(obj).length > 0,
        "Time slots by weekday are required",
      ),
  })
  .superRefine((val, ctx) => {
    const selected = new Set(val.byWeekday.map(String));

    for (const key of Object.keys(val.timeSlotsByWeekday)) {
      if (!selected.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeSlotsByWeekday", key],
          message: "Weekday has time slots but is not selected",
        });
      }

      const slots = val.timeSlotsByWeekday[key] ?? [];
      if (!uniqueTimeSlots(slots)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeSlotsByWeekday", key],
          message: "Duplicate time slots are not allowed",
        });
      }
    }
  });

const monthlyRecurrence = z.object({
  freq: z.literal("monthly"),
  interval: z.number().int().min(1).default(1),
  byMonthDay: z
    .array(z.number().int().min(1).max(31))
    .min(1, "Select month dates")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Duplicate month days are not allowed",
    ),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .refine(uniqueTimeSlots, "Duplicate time slots are not allowed"),
});

const customRecurrence = z.object({
  freq: z.literal("custom"),
  rrule: z.string().min(1, "RRULE is required"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .refine(uniqueTimeSlots, "Duplicate time slots are not allowed"),
});

export const createRecurringClassSchema = baseSchema
  .extend({
    type: z.literal("recurring"),
    dtstart: z
      .string()
      .datetime({ offset: true, message: "Invalid dtstart (ISO required)" }),
    until: z
      .string()
      .datetime({ offset: true, message: "Invalid until (ISO required)" })
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

export const occurrencesQuerySchema = z
  .object({
    from: z
      .string()
      .datetime({ offset: true, message: "Invalid 'from' date format" }),
    to: z
      .string()
      .datetime({ offset: true, message: "Invalid 'to' date format" }),
    branchId: objectIdSchema.optional(),
    instructorId: objectIdSchema.optional(),
    roomId: objectIdSchema.optional(),
    search: z.string().optional(),
    page: z
      .preprocess((val) => Number(val), z.number().int().min(1))
      .optional(),
    limit: z
      .preprocess((val) => Number(val), z.number().int().min(1).max(100))
      .optional(),
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

export const branchSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  address: z.string().max(200).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const instructorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(1000).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  branchIds: z.array(objectIdSchema).min(1, "At least one branch is required"),
});

export const roomSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  branchId: objectIdSchema,
  capacity: z.number().int().min(1).optional(),
});
