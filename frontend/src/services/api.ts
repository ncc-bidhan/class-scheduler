import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL).replace(/\/$/, "") + "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Class", "Occurrence", "Branch", "Instructor", "Room", "User"],
  endpoints: (_builder) => ({}),
});
