import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBookByIdQuery } from "@/feature/api/bookApi";

import { Bounce, toast } from "react-toastify";
import { ArrowLeft, Calendar } from "lucide-react";
import { useBorrowBookMutation } from "../api/borrowApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BorrowForm = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quantity: 1,
    dueDate: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  
  const {
    data: bookResponse,
    isLoading: isBookLoading,
    error: bookError,
  } = useGetBookByIdQuery(bookId!);

  
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

  const book = bookResponse?.data;

  
  useEffect(() => {
    const today = new Date();
    const defaultDueDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split("T")[0],
    }));
  }, []);

 
  const availableCopies = book ? book.copies : 0;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    
    if (!bookId) {
      newErrors.bookId = "Book ID is required";
    }

    
    if (bookId && !/^[0-9a-fA-F]{24}$/.test(bookId)) {
      newErrors.bookId = "Invalid book ID format";
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (book && formData.quantity > availableCopies) {
      newErrors.quantity = `Quantity cannot exceed available copies (${availableCopies})`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }

     
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      if (selectedDate > maxDate) {
        newErrors.dueDate = "Due date cannot be more than 1 year in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));

   
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(availableCopies, formData.quantity + increment)
    );
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));

    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !bookId) {
      console.error("Validation failed or bookId missing");
      return;
    }

   
    const borrowData = {
      bookId: bookId.trim(),
      quantity: Number(formData.quantity), 
      dueDate: formData.dueDate, 
    };

    

    try {
      const result = await borrowBook(borrowData).unwrap();

      toast.success(result.message || "Book borrowed successfully!", {
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

     
      setTimeout(() => {
        navigate("/borrow-summary");
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to borrow book. Please try again.";
      console.error("Borrow error:", error);

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as {
          data?: { message?: string; error?: string };
        };
        errorMessage =
          apiError.data?.message || apiError.data?.error || errorMessage;
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

  
  if (!bookId) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Invalid book ID.</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isBookLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">
              Book not found or error loading book details.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!book.available || availableCopies === 0) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              This book is currently unavailable for borrowing.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => navigate("/")} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle>Borrow Book</CardTitle>
          </div>

          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
            <p className="text-sm font-medium mt-2">
              Available Copies:{" "}
              <span className="text-green-600">{availableCopies}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={formData.quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={availableCopies}
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`text-center ${
                    errors.quantity ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={formData.quantity >= availableCopies}
                >
                  +
                </Button>
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

           
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={
                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  } 
                  max={
                    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  className={errors.dueDate ? "border-red-500" : ""}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isBorrowing}>
              {isBorrowing ? "Borrowing..." : "Borrow Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowForm;
