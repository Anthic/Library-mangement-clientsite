import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="  p-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blck">
          Library System
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <ul className="hidden md:flex gap-6">
          <li>
            <NavLink to="/" className="hover:text-text-blck">
              All Books
            </NavLink>
          </li>
          <li>
            <NavLink to="add-book" className="hover:text-blck">
              Add Book
            </NavLink>
          </li>
          <li>
            <NavLink to="borrow-summary" className="hover:text-text-blck">
              Borrow Summary
            </NavLink>
          </li>
        </ul>
      </div>

      {isOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 px-2">
          <li>
            <NavLink to="/" className="hover:text-gray-300" onClick={toggleMenu}>
              All Books
            </NavLink>
          </li>
          <li>
            <NavLink
              to="add-book"
              className="hover:text-gray-300"
              onClick={toggleMenu}
            >
              Add Book
            </NavLink>
          </li>
          <li>
            <NavLink
              to="borrow-summary"
              className="hover:text-gray-300"
              onClick={toggleMenu}
            >
              Borrow Summary
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}
