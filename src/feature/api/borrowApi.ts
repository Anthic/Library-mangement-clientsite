import type {
  IBorrow,
  IBorrowRequest,
  IBorrowSummary,
} from "@/app/borrow.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return import.meta.env.VITE_API_BASE_URL;
};
export const borrowApi = createApi({
  reducerPath: "borrowApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: ["Borrow", "Book"],
  endpoints: (builder) => ({
    //borrow book
    borrowBook: builder.mutation<
      { success: boolean; message: string; data: IBorrow },
      IBorrowRequest
    >({
      query: (body) => ({
        url: "/borrow",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Borrow", "Book"],
    }),
    //get borrowed summary with aggregation
    getBorrowedSummary: builder.query<
      { success: boolean; message: string; data: IBorrowSummary[] },
      void
    >({
      query: () => "/borrow",
      providesTags: ["Borrow"],
    }),
    //get all borrowed books

    getAllBorrows: builder.query<
      { success: boolean; message: string; data: IBorrow[] },
      void
    >({
      query: () => "/borrow",
      providesTags: ["Borrow"],
    }),
  }),
});

export const {
  useBorrowBookMutation,
  useGetBorrowedSummaryQuery,
  useGetAllBorrowsQuery,
} = borrowApi;
