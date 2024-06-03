import { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import { BOOKS_URL } from '../../../constants';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';
import { Pagination } from '../../Utils/Pagination';
import { ChangeQuantityOfBook } from './ChangeQuantityOfBook';

export const ChangeQuantityOfBooks = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [bookDelete, setBookDelete] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      const res = await fetch(
        `${BOOKS_URL}?page=${currentPage - 1}&size=${booksPerPage}`
      );

      if (!res.ok) throw new Error('Failed fetching books');

      const resJson = await res.json();
      const resData = resJson._embedded.books;
      setTotalAmountOfBooks(resJson.page.totalElements);
      setTotalPages(resJson.page.totalPages);
      const fecthedBooks: BookModel[] = [];

      for (const key in resData) {
        fecthedBooks.push({
          id: resData[key].id,
          title: resData[key].title,
          author: resData[key].author,
          description: resData[key].description,
          copies: resData[key].copies,
          copiesAvailable: resData[key].copiesAvailable,
          category: resData[key].category,
          img: resData[key].img,
        });
      }

      setBooks(fecthedBooks);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, booksPerPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const deleteBook = () => setBookDelete(!bookDelete);

  isLoading && <LoadingSpinner />;
  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  return (
    <div className='container mt-5'>
      {totalAmountOfBooks > 0 ? (
        <>
          <div className='mt-3'>
            <h3>Number of results: ({totalAmountOfBooks})</h3>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>
          {books.map((book) => (
            <ChangeQuantityOfBook
              key={book.id}
              book={book}
              delBook={deleteBook}
            />
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
