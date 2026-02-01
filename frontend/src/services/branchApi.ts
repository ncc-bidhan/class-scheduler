import { api } from "./api";
import type { Branch, SuccessResponse } from "../types";

export const branchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<
      SuccessResponse<Branch[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "branches",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Branch" as const, id: _id })),
              { type: "Branch", id: "LIST" },
            ]
          : [{ type: "Branch", id: "LIST" }],
    }),
    getBranch: builder.query<SuccessResponse<Branch>, string>({
      query: (id) => `branches/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Branch", id }],
    }),
    createBranch: builder.mutation<SuccessResponse<Branch>, Partial<Branch>>({
      query: (body) => ({
        url: "branches",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),
    updateBranch: builder.mutation<
      SuccessResponse<Branch>,
      { id: string; body: Partial<Branch> }
    >({
      query: ({ id, body }) => ({
        url: `branches/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),
    deleteBranch: builder.mutation<SuccessResponse<Branch>, string>({
      query: (id) => ({
        url: `branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useLazyGetBranchesQuery,
  useGetBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
