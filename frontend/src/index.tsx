import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51JN4wNBfHlaoy7Sme4pEwVnO4iHUfhZxh0t5HgSvudnLCjNdg0JKNuiP23XfJ9iTUcuQGmu13B4TyraQSA1oAbTL00dNJ2ITY5'
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);
