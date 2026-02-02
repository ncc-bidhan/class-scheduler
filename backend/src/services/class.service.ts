import mongoose from "mongoose";
import Class, { IClass } from "../models/Class";
import { expandOccurrencesForClass, Occurrence } from "./recurrence.service";

type OccurrenceQuery = {
  from: string;
  to: string;
  branchId?: string;
  instructorId?: string;
  roomId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type PaginatedOccurrences = {
  occurrences: Occurrence[];
  total: number;
  page: number;
  limit: number;
};

export type FieldError = { field: string; message: string };

export class ServiceError extends Error {
  statusCode: number;
  errors: FieldError[];
  constructor(message: string, statusCode = 400, errors: FieldError[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const overlaps = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) => {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE;
};

const assertNoConflicts = async (params: {
  branchId: string;
  instructorId: string;
  roomId: string;
  fromISO: string;
  toISO: string;
  newOccurrences: Occurrence[];
}) => {
  const { branchId, instructorId, roomId, fromISO, toISO, newOccurrences } =
    params;

  const candidates = (await Class.find({
    branchId: new mongoose.Types.ObjectId(branchId),
    $or: [
      { instructorId: new mongoose.Types.ObjectId(instructorId) },
      { roomId: new mongoose.Types.ObjectId(roomId) },
    ],
  })) as IClass[];

  for (const c of candidates) {
    const existing = expandOccurrencesForClass(c, fromISO, toISO);

    for (const n of newOccurrences) {
      for (const e of existing) {
        if (overlaps(n.startAt, n.endAt, e.startAt, e.endAt)) {
          const isInstructorConflict =
            String((c as any).instructorId) === String(instructorId);
          const isRoomConflict = String((c as any).roomId) === String(roomId);

          const conflictField = isInstructorConflict
            ? "instructorId"
            : isRoomConflict
              ? "roomId"
              : "timeSlots";

          throw new ServiceError("Schedule conflict detected", 400, [
            {
              field: conflictField,
              message: `Conflict with "${c.name}" (${String((c as any)._id)}) from ${e.startAt} to ${e.endAt}`,
            },
          ]);
        }
      }
    }
  }
};

export const createSingle = async (payload: any): Promise<IClass> => {
  const { dtstart, until, recurrence, ...clean } = payload;

  const fromISO = clean.startAt;
  const toISO = clean.endAt;

  const newOccurrences: Occurrence[] = [
    { classId: "new", startAt: fromISO, endAt: toISO },
  ];

  await assertNoConflicts({
    branchId: clean.branchId,
    instructorId: clean.instructorId,
    roomId: clean.roomId,
    fromISO,
    toISO,
    newOccurrences,
  });

  return Class.create({ ...clean, type: "single" });
};

export const createRecurring = async (payload: any): Promise<IClass> => {
  const { startAt, endAt, ...clean } = payload;

  const fromISO = clean.dtstart;

  const toISO = clean.until
    ? clean.until
    : new Date(
        new Date(clean.dtstart).getTime() + 1000 * 60 * 60 * 24 * 7 * 8,
      ).toISOString();

  const tempDoc = {
    ...clean,
    type: "recurring",
    _id: new mongoose.Types.ObjectId(),
  } as unknown as IClass;

  const newOccurrences = expandOccurrencesForClass(tempDoc, fromISO, toISO);

  await assertNoConflicts({
    branchId: clean.branchId,
    instructorId: clean.instructorId,
    roomId: clean.roomId,
    fromISO,
    toISO,
    newOccurrences,
  });

  return Class.create({ ...clean, type: "recurring" });
};

export const getOccurrences = async (
  query: OccurrenceQuery,
): Promise<PaginatedOccurrences> => {
  const filter: any = {};
  if (query.branchId) filter.branchId = query.branchId;
  if (query.instructorId) filter.instructorId = query.instructorId;
  if (query.roomId) filter.roomId = query.roomId;

  if (query.search && query.search.trim()) {
    const escapedSearch = query.search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: escapedSearch, $options: "i" };
  }

  const classes = (await Class.find(filter)
    .populate("instructorId")
    .populate("roomId")
    .populate("branchId")) as IClass[];

  const all: Occurrence[] = [];
  for (const c of classes) {
    all.push(...expandOccurrencesForClass(c, query.from, query.to));
  }

  all.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );

  const total = all.length;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || (total > 0 ? total : 10); 
  const skip = (page - 1) * limit;

  const paginated = all.slice(skip, skip + limit);

  return {
    occurrences: paginated,
    total,
    page,
    limit,
  };
};

export const getById = async (id: string): Promise<IClass | null> => {
  return Class.findById(id)
    .populate("branchId")
    .populate("instructorId")
    .populate("roomId");
};
