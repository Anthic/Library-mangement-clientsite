import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { ArrowLeft, BookOpen, Hash } from "lucide-react";
import type { IBorrowSummary } from "@/app/borrow.interface";
import { useGetBorrowedSummaryQuery } from "../api/borrowApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BorrowSummary = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetBorrowedSummaryQuery();

  const borrowSummary: IBorrowSummary[] = data?.data ?? [];


  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Borrow Summary</CardTitle>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Error loading borrow summary</p>
            <div className="space-x-2">
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl">Borrow Summary</CardTitle>
            </div>
            <div className="space-x-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                Refresh
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Overview of all borrowed books with total quantities
          </p>
        </CardHeader>

        <CardContent>
          {borrowSummary.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Books Borrowed Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start borrowing books to see them in this summary.
              </p>
              <Button onClick={() => navigate("/")}>Browse Books</Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Book Title</TableHead>
                    <TableHead className="font-semibold">ISBN</TableHead>
                    <TableHead className="font-semibold text-right">
                      Total Quantity Borrowed
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowSummary.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          {item.title || "Unknown Title"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          {item.isbn || "No ISBN"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {item.totalQuantityBorrowed || 0}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

       
          {borrowSummary.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total Books Borrowed:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {borrowSummary.length}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-600">
                  Total Quantity Borrowed:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {borrowSummary.reduce(
                    (total, item) => total + (item.totalQuantityBorrowed || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowSummary;
