import cls from './MainPage.module.scss'
import {BookList} from "entities/Book/ui/BookList/BookList";
import {Book} from "entities/Book";
import {useCallback, useContext, useEffect, useState} from "react";
import {BookModal} from "features/AddNewBook";
import {Context} from "App";
import {BookListItem} from "entities/Book/ui/BookListItem/BookListItem";
import {collectionRefs, fetchBooks} from "entities/Book/services/getBooks";

export const MainPage = () => {
    const {firestore, books, setBooks} = useContext(Context)

    const [bestBook, setBestBook] = useState<Book>()
    const [isLoading, setIsLoading] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [isRating, setIsRating] = useState(localStorage.getItem('isRating') === 'true' || false);
    const [isAuthor, setIsAuthor] = useState(localStorage.getItem('isAuthor') === 'true' || false);

    const onCloseModal = useCallback(() => {
        setIsModal(false)
    }, [])

    const onShowModal = useCallback(() => {
        setIsModal(true)
    }, [])

    const handleSort = (field: string) => {
        setIsRating(field === 'Rating')
        setIsAuthor(field === 'Author')

        localStorage.setItem('isRating', (field === 'Rating').toString());
        localStorage.setItem('isAuthor', (field === 'Author').toString());
    }

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const collectionRefsArray = await collectionRefs(firestore)
            let fetchedBooks = await fetchBooks(collectionRefsArray)

            if (isRating) {
                fetchedBooks = fetchedBooks.sort((a, b) => (b.Rating || 0) - (a.Rating || 0))
            }
            if (isAuthor) {
                fetchedBooks = fetchedBooks.sort((a, b) => a.Author.localeCompare(b.Author, undefined, {sensitivity: 'base'}))
            }

            setBooks(fetchedBooks)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
        fetchBestBook()
    }, [firestore, isAuthor, isRating, setBooks])

    async function fetchBestBook() {
        const collectionRefsArray = await collectionRefs(firestore);

        try {
            const querySnapshots = await Promise.all(
                collectionRefsArray.map((ref) =>
                    ref.where('PublicationYear', '>=', 2020).orderBy('PublicationYear', 'desc').get()
                )
            );

            const goodBooks = querySnapshots.flatMap((snapshot) => snapshot.docs.map((doc) => doc.data() as Book));

            const sortedBooks = goodBooks.sort((a, b) => (b.Rating || 0) - (a.Rating || 0));

            const recommendedBooksRef = firestore.collection('Recommended book');

            await recommendedBooksRef.get().then((existingBooksSnapshot) => {
                existingBooksSnapshot.forEach((doc) => doc.ref.delete());
            });

            const recommendedBooks = sortedBooks.filter((book) => book.Rating === sortedBooks[0].Rating);

            const index = Math.floor(Math.random() * recommendedBooks.length);
            const bestBook = recommendedBooks[index];

            await recommendedBooksRef.doc(bestBook.name).set(bestBook);
            setBestBook(bestBook);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button className={cls.newBookBtn} onClick={onShowModal}>Add new book</button>
            <button className={cls.sortBtn} onClick={() => handleSort('Year')}>Sort by Year</button>
            <button className={cls.sortBtn} onClick={() => handleSort('Rating')}>Sort by Rating</button>
            <button className={cls.sortBtn} onClick={() => handleSort('Author')}>Sort by Author</button>
            <BookModal isOpen={isModal} onClose={onCloseModal}/>
            <p className={cls.allBooksText}>All Books:</p>
            <BookList
                className={cls.list}
                books={books}
                isLoading={isLoading}
            />
            <p className={cls.recBooksText} style={{fontWeight: 700, fontSize: 30}}>Recommendation Book:</p>
            {bestBook ? <BookListItem className={cls.recItem} book={bestBook} notDelete/> : <p>No good books</p>}
        </div>
    )
}