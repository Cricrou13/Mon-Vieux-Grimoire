import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookItem from "../../components/Books/BookItem/BookItem";
import Banner from "../../images/home_banner.jpg";
import styles from "./Home.module.css";
import { getBooks } from "../../lib/common";

function Home() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const booksElements = books && books.length > 0 ? (
    books.map((book) => <BookItem key={book.id} book={book} size={3} />)
  ) : (
    <h1>Pas de livres trouvés</h1>
  );

  useEffect(() => {
    async function getBooksList() {
      const data = await getBooks();
      if (data) {
        setBooks(data);
        setLoading(false);
      }
    }
    getBooksList();
  }, []);
  const backgroundImageStyle = { backgroundImage: `url(${Banner})` };
  return (
    <div className={styles.Home}>
      <div className={styles.banner} style={backgroundImageStyle} />
      <main className={styles.main}>
        <header className={styles.head}>
          <h1>Nos Livres</h1>
          <p>à lire et à relire</p>
          <Link to="/Ajouter" className="button">
            + Ajouter un livre
          </Link>
        </header>
        <section className={styles.bookList}>
          {loading ? <h1>Chargement</h1> : booksElements}
        </section>
      </main>
    </div>
  );
}

export default Home;
