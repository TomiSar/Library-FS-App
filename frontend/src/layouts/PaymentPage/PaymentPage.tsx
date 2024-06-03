import { useOktaAuth } from '@okta/okta-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';
import { LoadingSpinner } from '../Utils/LoadingSpinner';
import { PAYMENTS_URL } from '../../constants';
import { RequestOptions } from '../Utils/RequestOptions';

export const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      if (authState && authState.isAuthenticated) {
        const reqOptions = RequestOptions({
          method: 'GET',
          authorization: authState?.accessToken?.accessToken,
        });

        const res = await fetch(
          `https://localhost:8443/api/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`,
          reqOptions
        );
        if (!res.ok) {
          throw new Error('Something went wrong!');
        }
        const resJson = await res.json();
        setFees(resJson.amount);
        setLoadingFees(false);
      }
    };
    fetchFees().catch((error: any) => {
      setLoadingFees(false);
      setHttpError(error.message);
    });
  }, [authState]);

  const elements = useElements();
  const stripe = useStripe();

  async function checkout() {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }

    setSubmitDisabled(true);

    let paymentInfo = new PaymentInfoRequest(
      Math.round(fees * 100),
      'USD',
      `${authState?.accessToken?.claims.sub}`
    );

    const reqOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentInfo),
    };
    const resStripe = await fetch(
      `${PAYMENTS_URL}/secure/payment-intent`,
      reqOptions
    );
    if (!resStripe.ok) {
      setHttpError(true);
      setSubmitDisabled(false);
      throw new Error('Failed fetching payment intent');
    }
    const stripeResJson = await resStripe.json();

    stripe
      .confirmCardPayment(
        stripeResJson.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: authState?.accessToken?.claims.sub,
            },
          },
        },
        { handleActions: false }
      )
      .then(async function (result: any) {
        if (result.error) {
          setSubmitDisabled(false);
          alert('Invalid Credit Card number');
          //   alert('There was an error');
        } else {
          const reqOptions = RequestOptions({
            method: 'PUT',
            authorization: authState?.accessToken?.accessToken,
          });

          const resStripe = await fetch(
            `${PAYMENTS_URL}/secure/payment-complete`,
            reqOptions
          );
          if (!resStripe.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Failed fetching payment complete');
          }
          setFees(0);
          setSubmitDisabled(false);
        }
      });
    setHttpError(false);
  }

  if (loadingFees) {
    return <LoadingSpinner />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className='container'>
      {fees > 0 && (
        <div className='card mt-3'>
          <h5 className='card-header'>
            Fees pending: <span className='text-danger'>${fees}</span>
          </h5>
          <div className='card-body'>
            <h5 className='card-title mb-3'>Credit Card</h5>
            <CardElement id='card-element' />
            <button
              disabled={submitDisabled}
              type='button'
              className='btn btn-md main-color text-white mt-3'
              onClick={checkout}
            >
              Pay fees
            </button>
          </div>
        </div>
      )}

      {fees === 0 && (
        <div className='mt-3'>
          <h5>You have no fees!</h5>
          <Link type='button' className='btn main-color text-white' to='search'>
            Explore top books
          </Link>
        </div>
      )}
      {submitDisabled && <LoadingSpinner />}
    </div>
  );
};
