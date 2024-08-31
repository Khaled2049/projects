import { useState } from "react";
import { SearchIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
  };
}

const Library = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  const handleBookClick = (id: string) => {
    navigate(`/library/book/${id}`);
  };

  const searchBooks = async () => {
    const apiKey = import.meta.env.VITE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-amber-50 p-4">
      {/* Search Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center border border-amber-200 rounded-lg shadow-md bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2 bg-white rounded-l-lg focus:outline-none"
            placeholder="Search for books..."
          />
          <button
            onClick={searchBooks}
            className="p-2 bg-amber-100 hover:bg-amber-200 rounded-r-lg"
          >
            <SearchIcon className="w-6 h-6 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Book Results */}
      <div className="w-full max-w-2xl">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              onClick={() => handleBookClick(book.id)}
              key={book.id}
              className="p-4 mb-4 border border-amber-200 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-semibold text-amber-700">
                {book.volumeInfo.title}
              </h2>
              <p className="text-sm text-amber-600">
                {book.volumeInfo.authors?.join(", ")}
              </p>
              <p className="text-sm text-amber-500">
                {book.volumeInfo.description
                  ? `${book.volumeInfo.description.slice(0, 150)}...`
                  : "No description available."}
              </p>
            </div>
          ))
        ) : (
          <p className="text-amber-500">
            No results found. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Library;
