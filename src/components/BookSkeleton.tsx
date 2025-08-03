const BookSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-4 font-semibold">All Books</div>
      <div className="animate-pulse px-4 py-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 border-b py-2 items-center"
          >
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSkeleton;
