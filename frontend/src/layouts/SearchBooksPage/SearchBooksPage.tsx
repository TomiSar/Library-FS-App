/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { BOOKS_URL } from '../../constants';
import { LoadingSpinner } from '../Utils/LoadingSpinner';
import { SearchBook } from './components/SearchBook';
import { Pagination } from '../Utils/Pagination';

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [categorySelection, setCategorySelection] = useState('Book category');

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      let url: string = '';

      if (searchUrl === '') {
        url = `${BOOKS_URL}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          '<pageNumber>',
          `${currentPage - 1}`
        );
        url = BOOKS_URL + searchWithPage;
      }

      const res = await fetch(url);

      if (!res.ok) throw new Error('Failed fetching books');

      const resJson = await res.json();
      const resData = resJson._embedded.books;
      setTotalAmountOfBooks(resJson.page.totalElements);
      setTotalPages(resJson.page.totalPages);
      const fecthedBooks: BookModel[] = [];

      for (const key in resData) {
        fecthedBooks.push({
          id: resData[key].id,
          title: resData[key].title,
          author: resData[key].author,
          description: resData[key].description,
          copies: resData[key].copies,
          copiesAvailable: resData[key].copiesAvailable,
          category: resData[key].category,
          img: resData[key].img,
        });
      }

      setBooks(fecthedBooks);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl, booksPerPage]);

  isLoading && <LoadingSpinner />;
  httpError && <LoadingSpinner />;

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search === '') {
      setSearchUrl('All');
      //   setCategorySelection('');
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`
      );
    }
    setCategorySelection('Book category');
  };

  const categoryField = (value: string) => {
    setCurrentPage(1);
    if (
      value.toLowerCase() === 'fe' ||
      value.toLowerCase() === 'be' ||
      value.toLowerCase() === 'data' ||
      value.toLowerCase() === 'devops'
    ) {
      setCategorySelection(value);
      setSearchUrl(
        `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
      );
    } else {
      setCategorySelection('All');
      setSearchUrl(`?page=0&size=${booksPerPage}`);
    }
  };

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='container'>
        <div>
          <div className='row mt-5'>
            <div className='col-6'>
              <div className='d-flex'>
                <input
                  className='form-control me-2'
                  type='search'
                  placeholder='Search'
                  aria-labelledby='Search'
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className='btn btn-outline-success'
                  onClick={() => searchHandleChange()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className='col-4'>
              <div className='dropdown'>
                <button
                  className='btn btn-secondary dropdown-toggle'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {categorySelection}
                </button>
                <ul className='dropdown-menu' aria-label='dropdownMenuButton1'>
                  <li onClick={() => categoryField('All')}>
                    <a className='dropdown-item' href='#'>
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryField('FE')}>
                    <a className='dropdown-item' href='#'>
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryField('BE')}>
                    <a className='dropdown-item' href='#'>
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryField('Data')}>
                    <a className='dropdown-item' href='#'>
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryField('DevOps')}>
                    <a className='dropdown-item' href='#'>
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className='mt-3'>
                <h5>Nomber of results ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{' '}
                items:
              </p>
              {books.map((book) => (
                <SearchBook key={book.id} book={book} />
              ))}
            </>
          ) : (
            <div className='m-5'>
              <h3>Can't find what you are looking for?</h3>
              <a
                type='button'
                className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                href='#'
              >
                Library Services
              </a>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
