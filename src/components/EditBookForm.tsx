import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import type { IBook } from "@/app/book.interface";
import {
  BookOpen,
  User,
  Tag,
  Hash,
  FileText,
  Copy,
  Save,
  X,
} from "lucide-react";
import {
  useGetBookByIdQuery,
  useUpdateBookMutation,
} from "@/feature/api/bookApi";

type Props = {
  bookId: string;
  onClose: () => void;
  onSuccess?: () => void;
};
const initialForm: IBook = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  description: "",
  copies: 1,
  available: true,
};

const EditBookForm = ({ bookId, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState<IBook>(initialForm);
  const titleRef = useRef<HTMLInputElement>(null);
  const {
    data: bookData,
    isSuccess,
    isLoading: isLoadingBook,
  } = useGetBookByIdQuery(bookId);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  useEffect(() => {
    if (isSuccess && bookData) {
      setFormData(bookData.data);
      titleRef.current?.focus();
    }
  }, [isSuccess, bookData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (type === "number") {
        const parsedValue = Number(value);
        return {
          ...prev,
          [name]: isNaN(parsedValue) ? 0 : parsedValue,
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: IBook = {
      ...formData,
      available: formData.copies > 0,
    };

    try {
      const result = await updateBook({ id: bookId, body: payload }).unwrap();
      toast.success(result.message || "✅ Book updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
        
      let errorMessage = "❌ Something went wrong!";

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as { data?: { message?: string } };
        errorMessage = apiError.data?.message || errorMessage;
      } else if (error && typeof error === "object" && "message" in error) {
        const genericError = error as { message?: string };
        errorMessage = genericError.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  if (isLoadingBook) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading book data...</span>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Book</h1>
        <p className="text-gray-600">Update the book information below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Book Title
          </label>
          <input
            ref={titleRef}
            type="text"
            name="title"
            placeholder="Enter the book title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-purple-600" />
            Author
          </label>
          <input
            ref={titleRef}
            type="text"
            name="author"
            placeholder="Enter the author's name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* Genre and ISBN Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-green-600" />
              Genre
            </label>
            <input
              ref={titleRef}
              type="text"
              name="genre"
              placeholder="e.g., Fiction, Science, History"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Hash className="w-4 h-4 text-orange-600" />
              ISBN
            </label>
            <input
              ref={titleRef}
              type="text"
              name="isbn"
              placeholder="978-0-123456-78-9"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-indigo-600" />
            Description
          </label>
          <textarea
            name="description"
            placeholder="Write a brief description of the book..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Copies Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Copy className="w-4 h-4 text-teal-600" />
            Number of Copies
          </label>
          <div className="relative">
            <input
              ref={titleRef}
              type="number"
              name="copies"
              min={0}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              value={formData.copies}
              onChange={handleChange}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">copies</span>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  formData.copies > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                Availability Status
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                formData.copies > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formData.copies > 0 ? "Available" : "Not Available"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isUpdating ? "Updating..." : "Update Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
