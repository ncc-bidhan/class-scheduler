import { DateTime } from "luxon";
import { RRule } from "rrule";
import { IClass, TimeSlot } from "../models/Class";

export type Occurrence = {
  classId: string;
  className?: string;
  startAt: string;
  endAt: string;
  instructorName?: string;
  roomName?: string;
  branchName?: string;
};

const parseHHMM = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return { h, m };
};

const overlapsWindow = (
  startISO: string,
  endISO: string,
  from: DateTime,
  to: DateTime,
) => {
  const s = DateTime.fromISO(startISO);
  const e = DateTime.fromISO(endISO);
  return s < to && e > from;
};

const makeISO = (date: DateTime, slot: TimeSlot) => {
  const { h: sh, m: sm } = parseHHMM(slot.startTime);
  const { h: eh, m: em } = parseHHMM(slot.endTime);

  const start = date.set({ hour: sh, minute: sm, second: 0, millisecond: 0 });

  const end = date.set({ hour: eh, minute: em, second: 0, millisecond: 0 });

  return { startISO: start.toISO()!, endISO: end.toISO()! };
};

const luxonWeekdayToSun0 = (luxonWeekday: number) => luxonWeekday % 7;

export const expandOccurrencesForClass = (
  doc: IClass,
  fromISO: string,
  toISO: string,
): Occurrence[] => {
  const from = DateTime.fromISO(fromISO);
  const to = DateTime.fromISO(toISO);

  const classId = String(doc._id);
  const className = doc.name;
  const instructorName = (doc.instructorId as any)?.name;
  const roomName = (doc.roomId as any)?.name;
  const branchName = (doc.branchId as any)?.name;

  const baseOccurrence = {
    classId,
    className,
    instructorName,
    roomName,
    branchName,
  };

  if (doc.type === "single") {
    if (!doc.startAt || !doc.endAt) return [];
    const s = DateTime.fromJSDate(doc.startAt).toISO()!;
    const e = DateTime.fromJSDate(doc.endAt).toISO()!;
    if (overlapsWindow(s, e, from, to))
      return [{ ...baseOccurrence, startAt: s, endAt: e }];
    return [];
  }

  if (!doc.dtstart || !doc.recurrence) return [];

  const dtstart = DateTime.fromJSDate(doc.dtstart);
  const until = doc.until ? DateTime.fromJSDate(doc.until) : null;

  const windowStart = from < dtstart ? dtstart : from;
  const windowEnd = until && to > until ? until : to;
  if (windowStart >= windowEnd) return [];

  const rec = doc.recurrence;
  const out: Occurrence[] = [];

  if (rec.freq === "daily") {
    const interval = Math.max(1, rec.interval ?? 1);
    const slots = rec.timeSlots ?? [];

    let cursor = windowStart.startOf("day");
    const endDay = windowEnd.startOf("day");

    while (cursor <= endDay) {
      const daysDiff = Math.floor(
        cursor.diff(dtstart.startOf("day"), "days").days,
      );
      if (daysDiff >= 0 && daysDiff % interval === 0) {
        for (const slot of slots) {
          const { startISO, endISO } = makeISO(cursor, slot);
          if (overlapsWindow(startISO, endISO, from, to)) {
            out.push({ ...baseOccurrence, startAt: startISO, endAt: endISO });
          }
        }
      }
      cursor = cursor.plus({ days: 1 });
    }
  }

  if (rec.freq === "weekly") {
    const interval = Math.max(1, rec.interval ?? 1);
    const byWeekday = rec.byWeekday ?? [];
    const slotsByWeekday = rec.timeSlotsByWeekday ?? new Map();

    let cursor = windowStart.startOf("day");
    const endDay = windowEnd.startOf("day");

    while (cursor <= endDay) {
      const weekDiff = Math.floor(
        cursor
          .minus({ days: cursor.weekday % 7 })
          .startOf("day")
          .diff(
            dtstart.minus({ days: dtstart.weekday % 7 }).startOf("day"),
            "weeks",
          ).weeks,
      );

      if (weekDiff >= 0 && weekDiff % interval === 0) {
        const luxonW = cursor.weekday;
        const sun0 = luxonWeekdayToSun0(luxonW);

        if (byWeekday.includes(sun0)) {
          const slots = (slotsByWeekday.get(String(sun0)) as TimeSlot[]) ?? [];
          for (const slot of slots) {
            const { startISO, endISO } = makeISO(cursor, slot);
            if (overlapsWindow(startISO, endISO, from, to)) {
              out.push({ ...baseOccurrence, startAt: startISO, endAt: endISO });
            }
          }
        }
      }
      cursor = cursor.plus({ days: 1 });
    }
  }

  if (rec.freq === "monthly") {
    const interval = Math.max(1, rec.interval ?? 1);
    const byMonthDay = rec.byMonthDay ?? [];
    const slots = rec.timeSlots ?? [];

    let cursor = windowStart.startOf("month");
    const endMonth = windowEnd.startOf("month");

    while (cursor <= endMonth) {
      const monthDiff = Math.floor(
        cursor.diff(dtstart.startOf("month"), "months").months,
      );
      if (monthDiff >= 0 && monthDiff % interval === 0) {
        for (const dayNum of byMonthDay) {
          const date = cursor.set({ day: dayNum });
          if (date.month === cursor.month) {
            for (const slot of slots) {
              const { startISO, endISO } = makeISO(date, slot);
              if (overlapsWindow(startISO, endISO, from, to)) {
                out.push({
                  ...baseOccurrence,
                  startAt: startISO,
                  endAt: endISO,
                });
              }
            }
          }
        }
      }
      cursor = cursor.plus({ months: 1 });
    }
  }

  if (rec.freq === "custom" && rec.rrule) {
    try {
      const rrule = RRule.fromString(rec.rrule);
      const slots = rec.timeSlots ?? [];

      const occurrences = rrule.between(from.toJSDate(), to.toJSDate(), true);

      for (const occ of occurrences) {
        const day = DateTime.fromJSDate(occ);
        for (const slot of slots) {
          const { startISO, endISO } = makeISO(day, slot);
          if (overlapsWindow(startISO, endISO, from, to)) {
            out.push({ ...baseOccurrence, startAt: startISO, endAt: endISO });
          }
        }
      }
    } catch (err) {
      console.error("RRule parse error:", err);
    }
  }

  return out.sort((a, b) => a.startAt.localeCompare(b.startAt));
};
