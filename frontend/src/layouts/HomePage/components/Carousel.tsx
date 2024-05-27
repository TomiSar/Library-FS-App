/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { ReturnBook } from './ReturnBook';
import { BOOKS_URL } from '../../../constants';
import BookModel from '../../../models/BookModel';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';

export const Carousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      const res = await fetch(`${BOOKS_URL}?page=0&size=9`);

      if (!res.ok) throw new Error('Failed fetching books');

      const resJson = await res.json();
      const resData = resJson._embedded.books;
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
  }, []);

  isLoading && <LoadingSpinner />;
  httpError && <LoadingSpinner />;

  return (
    <div className='container mt-5' style={{ height: 550 }}>
      <div className='homepage-carousel-title'>
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>
      <div
        id='carouselExampleControls'
        className='carousel carousel-dark slide mt-5 
      d-none d-lg-block'
        data-bs-interval='false'
      >
        {/* Desktop */}
        <div className='carousel-inner'>
          <div className='carousel-item active'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(0, 3).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>

          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(3, 6).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>

          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(6, 9).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
        <button
          className='carousel-control-prev'
          type='button'
          data-bs-target='#carouselExampleControls'
          data-bs-slide='prev'
        >
          <span
            className='carousel-control-prev-icon'
            aria-hidden='true'
          ></span>
          <span className='visually-hidden' aria-hidden='true'>
            Previous
          </span>
        </button>
        <button
          className='carousel-control-next'
          type='button'
          data-bs-target='#carouselExampleControls'
          data-bs-slide='next'
        >
          <span
            className='carousel-control-next-icon'
            aria-hidden='true'
          ></span>
          <span className='visually-hidden' aria-hidden='true'>
            Next
          </span>
        </button>
      </div>

      {/* Mobile */}
      <div className='d-lg-none mt-3'>
        <div className='row d-flex justify-content-center align-items-center'>
          {books.slice(6, 7).map((book) => (
            <ReturnBook key={book.id} book={book} />
          ))}
        </div>
      </div>
      <div className='homepage-carousel-title mt-3'>
        <a className='btn btn-outline-secondary btn-lg' href='#'>
          View More
        </a>
      </div>
    </div>
  );
};
