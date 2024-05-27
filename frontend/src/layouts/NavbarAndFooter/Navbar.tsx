/* eslint-disable jsx-a11y/anchor-is-valid */

export const Navbar = () => {
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
              <a className='nav-link' href='#'>
                Home
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#'>
                Search Books
              </a>
            </li>
          </ul>

          <ul className='navbar-nav ms-auto'>
            <li className='nav-item m-1'>
              <a className='btn btn-outline-light' type='button' href='#'>
                Sign In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
