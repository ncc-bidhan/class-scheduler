import { api } from "./api";
import type { Instructor, SuccessResponse } from "../types";

export const instructorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query<
      SuccessResponse<Instructor[]>,
      { branchId?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "instructors",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Instructor" as const, id: _id })),
              { type: "Instructor", id: "LIST" },
            ]
          : [{ type: "Instructor", id: "LIST" }],
    }),
    getInstructor: builder.query<SuccessResponse<Instructor>, string>({
      query: (id) => `instructors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Instructor", id }],
    }),
    createInstructor: builder.mutation<SuccessResponse<Instructor>, Partial<Instructor>>({
      query: (body) => ({
        url: "instructors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Instructor", id: "LIST" }],
    }),
    updateInstructor: builder.mutation<
      SuccessResponse<Instructor>,
      { id: string; body: Partial<Instructor> }
    >({
      query: ({ id, body }) => ({
        url: `instructors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Instructor", id },
        { type: "Instructor", id: "LIST" },
      ],
    }),
    deleteInstructor: builder.mutation<SuccessResponse<Instructor>, string>({
      query: (id) => ({
        url: `instructors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Instructor", id: "LIST" }],
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useLazyGetInstructorsQuery,
  useGetInstructorQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorApi;
