import { useState, useEffect } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import { REVIEWS_URL } from '../../../constants';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';
import { Review } from '../../Utils/Review';
import { Pagination } from '../../Utils/Pagination';

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    setIsLoading(true);
    const fetchBookReviews = async () => {
      const res = await fetch(
        `${REVIEWS_URL}/search/findByBookId?bookId=${bookId}&page=${
          currentPage - 1
        }&size=${reviewsPerPage - 1}`
      );

      if (!res.ok) throw new Error('Failed fetching reviews');

      const resJson = await res.json();
      const resData = resJson._embedded.reviews;
      setTotalAmountOfReviews(resJson.page.totalElements);
      setTotalPages(resJson.page.totalPages);

      const loadedReviews: ReviewModel[] = [];

      for (const key in resData) {
        loadedReviews.push({
          id: resData[key].id,
          userEmail: resData[key].userEmail,
          date: resData[key].date,
          rating: resData[key].rating,
          bookId: resData[key].bookId,
          reviewDescription: resData[key].reviewDescription,
        });
      }
      setReviews(loadedReviews);
      setIsLoading(false);
    };
    fetchBookReviews().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [bookId, reviewsPerPage, currentPage]);

  isLoading && <LoadingSpinner />;
  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='container mt-5'>
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
      </p>
      <div className='row'>
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
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
