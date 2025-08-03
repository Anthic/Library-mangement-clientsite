export interface IBorrow {
  _id?: string;
  book: string;           
  quantity: number;
  borrowDate: Date;
  dueDate: string;
  status?: "active" | "returned";
}

export interface IBorrowRequest {
  bookId: string;           
  quantity: number;
  dueDate: string;
}

export interface IBorrowSummary {
  title: string;            
  isbn: string;              
  totalQuantityBorrowed: number;  
}


export interface TBorrow {
  bookId: string;          
  quantity: number;
  dueDate: string;
}

export interface TBorrowCreate {
  book: string;              
  quantity: number;
  dueDate: string;
  borrowDate: Date;
  status: "active" | "returned";
}