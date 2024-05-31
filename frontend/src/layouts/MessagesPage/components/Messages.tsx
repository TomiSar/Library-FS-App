import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import MessageModel from '../../../models/MessageModel';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';
import { Pagination } from '../../Utils/Pagination';
import { RequestOptions } from '../../Utils/RequestOptions';
import { MESSAGES_URL } from '../../../constants';

export const Messages = () => {
  const { authState } = useOktaAuth();
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // Pagination
  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(
          `${MESSAGES_URL}/search/findByUserEmail?userEmail=${
            authState?.accessToken?.claims.sub
          }&page=${currentPage - 1}&size=${messagesPerPage}`,
          reqOptions
        );

        if (!res.ok) throw new Error('Failed fetching user messages');

        const resJson = await res.json();
        setMessages(resJson._embedded.messages);
        setTotalPages(resJson.page.totalPages);
      }
      setIsLoadingMessages(false);
    };

    fetchUserMessages().catch((error: any) => {
      setIsLoadingMessages(false);
      setHttpError(error.messages);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, messagesPerPage]);

  isLoadingMessages && <LoadingSpinner />;

  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='mt-2'>
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className='card mt-2 shadow p-3 bg-body rounded'>
                <h5>
                  Case #{message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from administration. Please be patient.
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here</h5>
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
