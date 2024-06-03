import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { LoadingSpinner } from '../../Utils/LoadingSpinner';
import MessageModel from '../../../models/MessageModel';
import { RequestOptions } from '../../Utils/RequestOptions';
import { MESSAGES_URL } from '../../../constants';
import { Pagination } from '../../Utils/Pagination';
import { AdminMessage } from './AdminMessage';
import AdminMessageRequest from '../../../models/AdminMessageRequest';

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  // Normal loading
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // Messages endpoints state
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Recall useEffect
  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    setIsLoadingMessages(true);
    const fetchUserMessages = async () => {
      if (authState && authState?.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });
        const res = await fetch(
          `${MESSAGES_URL}/search/findByClosed?closed=false&page=${
            currentPage - 1
          }&size=${messagesPerPage}`,
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
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, messagesPerPage]);

  isLoadingMessages && <LoadingSpinner />;

  httpError && (
    <div className='container m-5'>
      <p>{httpError}</p>
    </div>
  );

  async function submitResponseToQuestion(id: number, response: string) {
    if (
      authState &&
      authState?.isAuthenticated &&
      id !== null &&
      response !== ''
    ) {
      const messageAdminRequestModel: AdminMessageRequest =
        new AdminMessageRequest(id, response);
      const reqOptions = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageAdminRequestModel),
      };

      const res = await fetch(
        `${MESSAGES_URL}/secure/admin/message`,
        reqOptions
      );
      if (!res.ok) {
        throw new Error('Failed fetching user messages');
      }
      setBtnSubmit(!btnSubmit);
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='mt-3'>
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              key={message.id}
              message={message}
              submitResponseToQuestion={submitResponseToQuestion}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
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
