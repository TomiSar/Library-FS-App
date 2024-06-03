import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import {
  BOOKS_URL,
  BOOK_CHECKEDOUT_URL,
  BOOK_ISCHECKEDOUT_URL,
  CURRLOANS_URL,
  REVIEWS_URL,
} from '../../constants';
import { LoadingSpinner } from '../Utils/LoadingSpinner';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import ReviewModel from '../../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';
import ReviewRequestModel from '../../models/ReviewRequestModel';
import { RequestOptions } from '../Utils/RequestOptions';

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // Review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(false);

  // Loans count state
  const [currentLoansAccount, setCurrentLoansAccount] = useState(0);
  const [isLoadingCurrentLoansAccount, setIsLoadingCurrentLoansAccount] =
    useState(false);

  // Book checked out
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(false);

  // Payment
  const [displayError, setDisplayError] = useState(false);

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
  }, [bookId, isCheckedOut]);

  useEffect(() => {
    setIsLoadingReview(true);
    const fetchBookReviews = async () => {
      const res = await fetch(
        `${REVIEWS_URL}/search/findByBookId?bookId=${bookId}`
      );

      if (!res.ok) throw new Error('Failed fetching reviews');

      const resJson = await res.json();
      const resData = resJson._embedded.reviews;
      const loadedReviews: ReviewModel[] = [];
      let weightedStarsReviews: number = 0;

      for (const key in resData) {
        loadedReviews.push({
          id: resData[key].id,
          userEmail: resData[key].userEmail,
          date: resData[key].date,
          rating: resData[key].rating,
          bookId: resData[key].bookId,
          reviewDescription: resData[key].reviewDescription,
        });
        weightedStarsReviews = weightedStarsReviews + resData[key].rating;
      }
      if (loadedReviews) {
        const roundStars = (
          Math.round((weightedStarsReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(roundStars));
      }
      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [bookId, isReviewLeft]);

  useEffect(() => {
    setIsLoadingUserReview(true);
    const fetchUserReviewBook = async () => {
      if (authState && authState?.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(
          `${REVIEWS_URL}/secure/user/book?bookId=${bookId}`,
          reqOptions
        );

        if (!res.ok) throw new Error('Failed fetching current user reviews');

        const resJson = await res.json();
        setIsReviewLeft(resJson);
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState, bookId]);

  useEffect(() => {
    const fetchCurrentUserLoansAccount = async () => {
      if (authState && authState.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(CURRLOANS_URL, reqOptions);
        if (!res.ok) throw new Error('Failed fetching current loans count');

        const resJson = await res.json();
        setCurrentLoansAccount(resJson);
      }
      setIsLoadingCurrentLoansAccount(false);
    };

    fetchCurrentUserLoansAccount().catch((error: any) => {
      setIsLoadingCurrentLoansAccount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(
          `${BOOK_ISCHECKEDOUT_URL}?bookId=${bookId}`,
          reqOptions
        );
        if (!res.ok) throw new Error('Failed fetching checked out books');

        const resJson = await res.json();
        setIsCheckedOut(resJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState, bookId, isCheckedOut]);

  isLoading &&
    isLoadingReview &&
    isLoadingUserReview &&
    isLoadingCurrentLoansAccount &&
    isReviewLeft &&
    isLoadingBookCheckedOut && <LoadingSpinner />;

  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );

  async function checkoutBook() {
    const reqOptions = RequestOptions({
      method: 'PUT',
      authorization: authState?.accessToken?.accessToken,
    });

    const res = await fetch(
      `${BOOK_CHECKEDOUT_URL}?bookId=${book?.id}`,
      reqOptions
    );

    if (!res.ok) {
      setDisplayError(true);
      return;
      // throw new Error('Failed fetching checked out books');
    }

    setDisplayError(false);
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );

    const reqOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewRequestModel),
    };

    const res = await fetch(`${REVIEWS_URL}/secure`, reqOptions);
    if (!res.ok) throw new Error('Failed fetching reviews from books');
    setIsReviewLeft(true);
  }

  return (
    <div>
      <div className='container d-none d-lg-block'>
        {displayError && (
          <div className='alert alert-danger mt-3' role='alert'>
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
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
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansAccount={currentLoansAccount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className='container d-lg-none mt-5'>
        {displayError && (
          <div className='alert alert-danger mt-3' role='alert'>
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
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
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansAccount={currentLoansAccount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
