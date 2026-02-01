import { api } from "./api";
import type { Room, SuccessResponse } from "../types";

export const roomApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<
      SuccessResponse<Room[]>,
      { branchId?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "rooms",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Room" as const, id: _id })),
              { type: "Room", id: "LIST" },
            ]
          : [{ type: "Room", id: "LIST" }],
    }),
    getRoom: builder.query<SuccessResponse<Room>, string>({
      query: (id) => `rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Room", id }],
    }),
    createRoom: builder.mutation<SuccessResponse<Room>, Partial<Room>>({
      query: (body) => ({
        url: "rooms",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }],
    }),
    updateRoom: builder.mutation<
      SuccessResponse<Room>,
      { id: string; body: Partial<Room> }
    >({
      query: ({ id, body }) => ({
        url: `rooms/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Room", id },
        { type: "Room", id: "LIST" },
      ],
    }),
    deleteRoom: builder.mutation<SuccessResponse<Room>, string>({
      query: (id) => ({
        url: `rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useLazyGetRoomsQuery,
  useGetRoomQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
