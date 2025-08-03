import { useState } from "react";
import { useDeleteBookMutation, useGetBooksQuery } from "@/feature/api/bookApi";
import type { IBook } from "@/app/book.interface";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Bounce, toast } from "react-toastify";
import BookSkeleton from "./BookSkeleton";
import Modal from "./Modal";
import EditBookForm from "./EditBookForm";

const BookList = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetBooksQuery();
  const books: IBook[] = data?.data ?? [];
  const [deleteBook] = useDeleteBookMutation();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteBook(id).unwrap();
      toast.success(result.message || "Book deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      let errorMessage = "There is problem to delete book";

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as { data?: { message?: string } };
        errorMessage = apiError.data?.message || errorMessage;
      } else if (error && typeof error === "object" && "message" in error) {
        const genericError = error as { message?: string };
        errorMessage = genericError.message || errorMessage;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleEditClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBookId("");
  };

  const handleEditSuccess = () => {
    refetch();
    handleCloseEditModal();
  };

  if (isLoading)
    return (
      <div>
        <BookSkeleton />
      </div>
    );
  if (error) return <div>Error loading books</div>;

  return (
    <>
      <div className="w-11/12 mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">All Books</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.copies}</TableCell>
                  <TableCell>
                    <span
                      className={
                        book.available ? "text-green-600" : "text-red-600"
                      }
                    >
                      {book.available ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => book._id && handleEditClick(book._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => book._id && handleDelete(book._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/borrow/${book._id}`)}
                    >
                      Borrow
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No books found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Book"
      >
        {selectedBookId && (
          <EditBookForm
            bookId={selectedBookId}
            onClose={handleCloseEditModal}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </>
  );
};

export default BookList;
