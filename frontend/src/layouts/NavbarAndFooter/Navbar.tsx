import { useOktaAuth } from '@okta/okta-react';
import { Link, NavLink } from 'react-router-dom';
import { LoadingSpinner } from '../Utils/LoadingSpinner';

export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const handleLogout = () => oktaAuth.signOut();
  !authState && <LoadingSpinner />;

  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span className='navbar-brand'>Love to read</span>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavDropdrown'
          aria-controls='navbarNavDropdrown'
          aria-expanded='false'
          aria-label='Toggle Navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavDropdrown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>
                Search Books
              </NavLink>
            </li>
            {authState?.isAuthenticated && (
              <>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/shelf'>
                    Shelf
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/messages'>
                    Messages
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className='navbar-nav ms-auto'>
            {!authState?.isAuthenticated ? (
              <li className='nav-item m-1'>
                <Link
                  className='btn btn-outline-light'
                  type='button'
                  to='/login'
                >
                  Sign In
                </Link>
              </li>
            ) : (
              <li>
                <button
                  className='btn btn-outline-light'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
