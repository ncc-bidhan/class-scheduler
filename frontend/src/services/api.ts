import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") + "/api",
  }),
  tagTypes: ["Class", "Occurrence", "Branch", "Instructor", "Room"],
  endpoints: (_builder) => ({}),
});
