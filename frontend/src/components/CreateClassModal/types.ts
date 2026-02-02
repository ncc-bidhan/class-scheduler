import { DateTime } from "luxon";
import type { Recurrence } from "../../types";

export interface CreateClassFormData {
  name: string;
  description: string;
  branchId: string;
  instructorId: string;
  roomId: string;
  durationMinutes: number;
  capacity: number;
  waitlistCapacity: number;
  allowDropIn: boolean;
  startAt: DateTime;
  endAt: DateTime;
  dtstart: DateTime;
  until: DateTime | null;
  recurrence: Recurrence;
}
