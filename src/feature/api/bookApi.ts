import type { IBook } from "@/app/book.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return import.meta.env.VITE_API_BASE_URL;
};

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: ["Book", "Borrow"],
  endpoints: (builder) => ({
    //get all the books
    getBooks: builder.query<
      { success: boolean; message: string; data: IBook[] },
      void
    >({
      query: () => "/books",
      providesTags: ["Book"],
    }),
    //get a single book by id
    getBookById: builder.query<
      { success: boolean; message: string; data: IBook },
      string
    >({
      query: (id) => `/books/${id}`,
    }),
    //add a new book
    addBook: builder.mutation<
      { success: boolean; message: string; data: IBook },
      Partial<IBook>
    >({
      query: (body) => ({ url: "/books", method: "POST", body }),
      invalidatesTags: ["Book"],
    }),
    //update an existing book
    updateBook: builder.mutation<
      { success: boolean; message: string; data: IBook },
      { id: string; body: Partial<IBook> }
    >({
      query: ({ id, body }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Book"],
    }),
    //delete a book
    deleteBook: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/books/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Book"],
      }
    ),
  }),
});

export const {
  useAddBookMutation,
  useDeleteBookMutation,
  useGetBookByIdQuery,
  useGetBooksQuery,
  useUpdateBookMutation,
} = bookApi;
