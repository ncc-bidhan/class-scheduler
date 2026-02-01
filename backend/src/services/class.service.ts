import Class, { IClass } from "../models/Class";
import { expandOccurrencesForClass, Occurrence } from "./recurrence.service";

type OccurrenceQuery = {
  from: string;
  to: string;
  branchId?: string;
  instructorId?: string;
  roomId?: string;
};

export const createSingle = async (payload: any) => {
  return Class.create({ ...payload, type: "single" });
};

export const createRecurring = async (payload: any) => {
  return Class.create({ ...payload, type: "recurring" });
};

export const getOccurrences = async (
  query: OccurrenceQuery,
): Promise<Occurrence[]> => {
  const filter: any = {};
  if (query.branchId) filter.branchId = query.branchId;
  if (query.instructorId) filter.instructorId = query.instructorId;
  if (query.roomId) filter.roomId = query.roomId;

  const classes = (await Class.find(filter)) as IClass[];

  const all: Occurrence[] = [];
  for (const c of classes) {
    const occ = expandOccurrencesForClass(c, query.from, query.to);
    all.push(...occ);
  }

  all.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  return all;
};
