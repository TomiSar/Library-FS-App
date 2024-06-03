import { useEffect, useState } from 'react';
import HistoryModel from '../../../models/HistoryModel';
import { useOktaAuth } from '@okta/okta-react';
import { HISTORY_URL } from '../../../constants';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';
import { Pagination } from '../../Utils/Pagination';
import { Link } from 'react-router-dom';
import { RequestOptions } from '../../Utils/RequestOptions';

export const HistoryPage = () => {
  const { authState } = useOktaAuth();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // Histories
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoadingHistory(true);
    const fetchUserHistory = async () => {
      if (authState && authState.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(
          `${HISTORY_URL}/search/findBooksByUserEmail?userEmail=${
            authState.accessToken?.claims.sub
          }&page=${currentPage - 1}&size=5`,
          reqOptions
        );

        if (!res.ok) throw new Error('Failed fetching user history');

        const resJson = await res.json();
        setHistories(resJson._embedded.histories);
        setTotalPages(resJson.page.totalPages);
      }
      setIsLoadingHistory(false);
    };

    fetchUserHistory().catch((error: any) => {
      setIsLoadingHistory(false);
      setHttpError(error.message);
    });
  }, [authState, currentPage]);

  isLoadingHistory && <LoadingSpinner />;

  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='mt-2'>
      {histories.length > 0 ? (
        <>
          <h5>Recent History:</h5>

          {histories.map((history) => (
            <div key={history.id}>
              <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                <div className='row g-0'>
                  <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                      {history.img ? (
                        <img
                          src={history.img}
                          width='123'
                          height='196'
                          alt='Book'
                        />
                      ) : (
                        <img
                          src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                          width='123'
                          height='196'
                          alt='Default'
                        />
                      )}
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                      {history.img ? (
                        <img
                          src={history.img}
                          width='123'
                          height='196'
                          alt='Book'
                        />
                      ) : (
                        <img
                          src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                          width='123'
                          height='196'
                          alt='Default'
                        />
                      )}
                    </div>
                  </div>
                  <div className='col'>
                    <div className='card-body'>
                      <h5 className='card-title'> {history.author} </h5>
                      <h4>{history.title}</h4>
                      <p className='card-text'>{history.description}</p>
                      <hr />
                      <p className='card-text'>
                        {' '}
                        Checked out on: {history.checkoutDate}
                      </p>
                      <p className='card-text'>
                        {' '}
                        Returned on: {history.returnedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className='mt-3'>Currently no history: </h3>
          <Link className='btn btn-primary' to={'search'}>
            Search for new book
          </Link>
        </>
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
