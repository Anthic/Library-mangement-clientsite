import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllBooks from "./pages/AllBooks";
import Footer from "./components/Footer";
import AddBook from "./pages/AddBook";
import BorrowForm from "./feature/books/BorrowForm";
import BorrowSummary from "./feature/books/BorrowSummary";


function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<AllBooks />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/borrow/:bookId" element={<BorrowForm />} />
          <Route path="/borrow-summary" element={<BorrowSummary />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
