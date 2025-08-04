# Library Management System - Client Side 📚

A minimal library management system built with React, Redux Toolkit (RTK Query), TypeScript, and Tailwind CSS.

## Live Demo 🌐
[Visit Live Site](https://library-mangement-clientsite.vercel.app/)

## Features 🚀

### Book Management
- View all books in a responsive table format
- Add new books with details
- Edit existing book information
- Delete books with confirmation
- Borrow books with quantity and due date

### Core Functionalities
- **Book List:** Display all books with search and filter
- **Add Book:** Create new book entries
- **Edit Book:** Modify existing book details
- **Delete Book:** Remove books with confirmation
- **Borrow Book:** Track book borrowing with due dates
- **Borrow Summary:** View all borrowed books summary

## Tech Stack 💻

- **React** - Frontend library
- **TypeScript** - Type safety
- **Redux Toolkit & RTK Query** - State management
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Toastify** - Notifications

## Getting Started 🏁

1. **Clone the repository**
```bash
git clone [your-repo-link]
```
2. **Install dependencies**
```bash
cd [your-repo-name]
npm install
```
3. **Start the development server**
```bash
npm run dev
``` 
4. **Open in your browser**
   Navigate to `http://localhost:5173` (or the port specified in your environment).
5. **Project Structure**
```
src/
  ├── app/
  │   ├── store.ts
  │   └── hook.ts
  ├── components/
  │   ├── BookList.tsx
  │   ├── BookForm.tsx
  │   └── ...
  ├── features/
  │   └── api/
  │       ├── bookApi.ts
  │       └── borrowApi.ts
  └── pages/
      ├── AllBooks.tsx
      ├── AddBook.tsx
      └── ...
 ```   
6. **API Integration 🔌**
```
Uses RTK Query for API calls
Endpoints include:
  GET /books - Fetch all books
  POST /books - Add new book
  PATCH /books/:id - Update book
  DELETE /books/:id - Delete book
  POST /borrow - Borrow book
  ```
7. **Deployment**
   - Build the project using `npm run build`
   - Deploy the `dist` folder to your preferred hosting service
   - Ensure environment variables are set in the hosting environment
