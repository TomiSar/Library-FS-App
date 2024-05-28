import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { BOOKS_URL } from '../../constants';
import { LoadingSpinner } from '../Utils/LoadingSpinner';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    setIsLoading(true);
    const fetchBook = async () => {
      const res = await fetch(`${BOOKS_URL}/${bookId}`);

      if (!res.ok) throw new Error('Failed fetching books');

      const resJson = await res.json();

      const fecthedBook: BookModel = {
        id: resJson.id,
        title: resJson.title,
        author: resJson.author,
        description: resJson.description,
        copies: resJson.copies,
        copiesAvailable: resJson.copiesAvailable,
        category: resJson.category,
        img: resJson.img,
      };

      setBook(fecthedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [bookId]);

  isLoading && <LoadingSpinner />;
  httpError && <LoadingSpinner />;

  return (
    <div>
      <div className='container d-none d-lg-block'>
        <div className='row mt-5'>
          <div className='col-sm-2 col-md-2'>
            {book?.img ? (
              <img src={book?.img} width='226' height='349' alt='Book' />
            ) : (
              <img
                src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                width='226'
                height='349'
                alt='Book'
              />
            )}
          </div>
          <div className='col-4 col-md-4 container'>
            <div className='ml-2'>
              <h2>{book?.title}</h2>
              <h5 className='text-primary'>{book?.author}</h5>
              <p className='lead'>{book?.description}</p>
              <StarsReview rating={4.5} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
      </div>
      <div className='container d-lg-none mt-5'>
        <div className='d-flex justify-content-center alighn-items-center'>
          {book?.img ? (
            <img src={book?.img} width='226' height='349' alt='Book' />
          ) : (
            <img
              src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
              width='226'
              height='349'
              alt='Book'
            />
          )}
        </div>
        <div className='mt-4'>
          <div className='ml-2'>
            <h2>{book?.title}</h2>
            <h5 className='text-primary'>{book?.author}</h5>
            <p className='lead'>{book?.description}</p>
            <StarsReview rating={4.5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={false} />
        <hr />
      </div>
    </div>
  );
};
