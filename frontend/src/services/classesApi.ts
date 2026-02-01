import { api } from "./api";
import type { ClassDoc, Occurrence, SuccessResponse } from "../types";

export interface GetOccurrencesArgs {
  from: string;
  to: string;
  branchId?: string;
  instructorId?: string;
  roomId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const classesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOccurrences: builder.query<
      SuccessResponse<Occurrence[]>,
      GetOccurrencesArgs
    >({
      query: (params) => ({
        url: "classes/occurrences",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ classId }) => ({
                type: "Occurrence" as const,
                id: classId,
              })),
              { type: "Occurrence", id: "LIST" },
            ]
          : [{ type: "Occurrence", id: "LIST" }],
    }),
    createSingleClass: builder.mutation<
      SuccessResponse<ClassDoc>,
      Partial<ClassDoc>
    >({
      query: (body) => ({
        url: "classes/single",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Occurrence", id: "LIST" },
        { type: "Class", id: "LIST" },
      ],
    }),
    createRecurringClass: builder.mutation<
      SuccessResponse<ClassDoc>,
      Partial<ClassDoc>
    >({
      query: (body) => ({
        url: "classes/recurring",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Occurrence", id: "LIST" },
        { type: "Class", id: "LIST" },
      ],
    }),
    getClassById: builder.query<SuccessResponse<ClassDoc>, string>({
      query: (id) => `classes/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Class", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOccurrencesQuery,
  useCreateSingleClassMutation,
  useCreateRecurringClassMutation,
  useGetClassByIdQuery,
} = classesApi;
