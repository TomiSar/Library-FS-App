/* eslint-disable jsx-a11y/anchor-is-valid */
import BookModel from '../../../models/BookModel';

type Props = {
  book: BookModel;
};

export const ReturnBook = ({ book }: Props) => {
  return (
    <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
      <div className='text-center'>
        {book.img ? (
          <img src={book.img} alt='book' width='151' height='233' />
        ) : (
          <img
            src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
            alt='book'
            width='151'
            height='233'
          />
        )}
        <h6 className='mt-2'>{book.title}</h6>
        <p>{book.author}</p>
        <a className='btn main-color text-white' href='#'>
          Reserve
        </a>
      </div>
    </div>
  );
};
