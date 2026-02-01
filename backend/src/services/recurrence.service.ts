import { DateTime } from "luxon";
import { IClass } from "../models/Class";

export type Occurrence = {
  classId: string;
  startAt: string; // ISO
  endAt: string; // ISO
};

type TimeSlot = { startTime: string; endTime: string };

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

const makeISO = (date: DateTime, tz: string, slot: TimeSlot) => {
  const { h: sh, m: sm } = parseHHMM(slot.startTime);
  const { h: eh, m: em } = parseHHMM(slot.endTime);

  const start = date
    .set({ hour: sh, minute: sm, second: 0, millisecond: 0 })
    .setZone(tz, { keepLocalTime: true });
  const end = date
    .set({ hour: eh, minute: em, second: 0, millisecond: 0 })
    .setZone(tz, { keepLocalTime: true });

  return { startISO: start.toISO()!, endISO: end.toISO()! };
};

const luxonWeekdayToSun0 = (luxonWeekday: number) => luxonWeekday % 7; // Sun=0

export const expandOccurrencesForClass = (
  doc: IClass,
  fromISO: string,
  toISO: string,
): Occurrence[] => {
  const from = DateTime.fromISO(fromISO, { zone: doc.timezone });
  const to = DateTime.fromISO(toISO, { zone: doc.timezone });

  const classId = String(doc._id);

  // Single class
  if (doc.type === "single") {
    if (!doc.startAt || !doc.endAt) return [];
    const s = DateTime.fromJSDate(doc.startAt).toISO()!;
    const e = DateTime.fromJSDate(doc.endAt).toISO()!;
    if (overlapsWindow(s, e, from, to))
      return [{ classId, startAt: s, endAt: e }];
    return [];
  }

  // Recurring
  if (!doc.dtstart || !doc.recurrence) return [];

  const tz = doc.timezone;
  const dtstart = DateTime.fromJSDate(doc.dtstart, { zone: tz });
  const until = doc.until ? DateTime.fromJSDate(doc.until, { zone: tz }) : null;

  const windowStart = from < dtstart ? dtstart : from;
  const windowEnd = until && to > until ? until : to;
  if (windowStart >= windowEnd) return [];

  const rec = doc.recurrence;
  const out: Occurrence[] = [];

  // DAILY
  if (rec.freq === "daily") {
    const interval = Math.max(1, rec.interval ?? 1);
    const slots = rec.timeSlots ?? [];
    let cursor = windowStart.startOf("day");
    const endDay = windowEnd.startOf("day");

    while (cursor <= endDay) {
      for (const slot of slots) {
        const { startISO, endISO } = makeISO(cursor, tz, slot);
        if (overlapsWindow(startISO, endISO, from, to))
          out.push({ classId, startAt: startISO, endAt: endISO });
      }
      cursor = cursor.plus({ days: interval });
    }
  }

  // WEEKLY
  if (rec.freq === "weekly") {
    const interval = Math.max(1, rec.interval ?? 1);
    const selected = new Set((rec.byWeekday ?? []).map(Number)); // 0..6
    const slotsByDay = rec.timeSlotsByWeekday ?? new Map<string, TimeSlot[]>();

    const anchorWeek = dtstart.startOf("week");

    let cursor = windowStart.startOf("day");
    const endDay = windowEnd.startOf("day");

    while (cursor <= endDay) {
      const wd = luxonWeekdayToSun0(cursor.weekday);
      if (selected.has(wd)) {
        const weekDiff = Math.floor(
          cursor.startOf("week").diff(anchorWeek, "weeks").weeks,
        );
        if (weekDiff % interval === 0) {
          const slots = slotsByDay.get(String(wd)) ?? [];
          for (const slot of slots) {
            const { startISO, endISO } = makeISO(cursor, tz, slot);
            if (overlapsWindow(startISO, endISO, from, to))
              out.push({ classId, startAt: startISO, endAt: endISO });
          }
        }
      }
      cursor = cursor.plus({ days: 1 });
    }
  }

  // MONTHLY
  if (rec.freq === "monthly") {
    const interval = Math.max(1, rec.interval ?? 1);
    const monthDays = rec.byMonthDay ?? [];
    const slots = rec.timeSlots ?? [];

    const anchorMonth = dtstart.startOf("month");

    let cursorMonth = windowStart.startOf("month");
    const endMonth = windowEnd.startOf("month");

    while (cursorMonth <= endMonth) {
      const monthDiff = Math.floor(
        cursorMonth.diff(anchorMonth, "months").months,
      );
      if (monthDiff % interval === 0) {
        for (const dom of monthDays) {
          const date = cursorMonth.set({ day: dom });
          if (!date.isValid) continue;
          for (const slot of slots) {
            const { startISO, endISO } = makeISO(date, tz, slot);
            if (overlapsWindow(startISO, endISO, from, to))
              out.push({ classId, startAt: startISO, endAt: endISO });
          }
        }
      }
      cursorMonth = cursorMonth.plus({ months: 1 });
    }
  }

  // CUSTOM (optional later)
  // If you want it now, install `rrule` and I’ll drop in the code.

  out.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  return out;
};
