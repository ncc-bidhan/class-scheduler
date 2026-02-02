// Generic API Responses
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  title: string;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  title: string;
  message: string;
  errors: FieldError[];
}

// Class & Occurrence Types
export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export interface Recurrence {
  freq: "daily" | "weekly" | "monthly" | "custom";
  interval?: number;
  timeSlots?: TimeSlot[];
  byWeekday?: number[];
  timeSlotsByWeekday?: Record<string, TimeSlot[]>;
  byMonthDay?: number[];
  rrule?: string;
}

export interface ClassDoc {
  id: string;
  type: "single" | "recurring";
  name: string;
  description?: string;
  branchId: string | Branch;
  instructorId: string | Instructor;
  roomId: string | Room;
  durationMinutes: number;
  capacity: number;
  waitlistCapacity: number;
  allowDropIn: boolean;

  // Single class fields
  startAt?: string;
  endAt?: string;

  // Recurring class fields
  dtstart?: string;
  until?: string | null;
  recurrence?: Recurrence;

  createdAt: string;
  updatedAt: string;
}

export interface Occurrence {
  classId: string;
  className?: string;
  startAt: string;
  endAt: string;
  instructorName?: string;
  roomName?: string;
  branchName?: string;
}

// Legacy types (keep for compatibility if needed, but ClassDoc is preferred)
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Branch {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  _id: string;
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  branchIds: (string | { _id: string; name: string })[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  name: string;
  branchId: string | { _id: string; name: string };
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}
