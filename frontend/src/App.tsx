import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';

export const App = () => {
  return (
    <div>
      <Navbar />
      {/* HomePage commented out temporarily because testing Serac functionality */}
      {/* <HomePage /> */}
      <SearchBooksPage />
      <Footer />
    </div>
  );
};
