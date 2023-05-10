import cls from './MainPage.module.scss'
import {BookList} from "entities/Book/ui/BookList/BookList";
import {Book} from "entities/Book";
import {useCallback, useContext, useEffect, useState} from "react";
import {BookModal} from "features/AddNewBook";
import {Context} from "App";
import {BookListItem} from "entities/Book/ui/BookListItem/BookListItem";

export const MainPage = () => {
    const {firestore, books, setBooks} = useContext(Context)

    const [bestBook, setBestBook] = useState<Book>()
    const [isLoading, setIsLoading] = useState(true)
    const [isModal, setIsModal] = useState(false)

    const onCloseModal = useCallback(() => {
        setIsModal(false)
    }, [])

    const onShowModal = useCallback(() => {
        setIsModal(true)
    }, [])

    useEffect(() => {
        fetchBooks()
        fetchBestBook()
    }, [])

    async function fetchBooks() {
        setIsLoading(true)
        const collectionRefs = [
            firestore.collection("2020"),
            firestore.collection("2018"),
            firestore.collection("2015"),
            firestore.collection("Books without a year")
        ];
        try {
            const [booksFrom2020, booksFrom2018, booksFrom2015, booksWithoutYear] = await Promise.all(
                collectionRefs.map((ref) =>
                    ref.get().then((snapshot: { docs: any[] }) => snapshot.docs.map((doc) => doc.data()))
                )
            );
            const allBooks = [...booksFrom2020, ...booksFrom2018, ...booksFrom2015, ...booksWithoutYear]
            setBooks(allBooks)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchBestBook() {
        const collectionRefs = [
            firestore.collection('2020'),
            firestore.collection('2018'),
            firestore.collection('2015'),
            firestore.collection('Books without a year')
        ];

        try {
            const goodBooks = await Promise.all(
                collectionRefs.map((ref) =>
                    ref.where('PublicationYear', '>=', 2020).orderBy('PublicationYear', 'desc').get()
                )
            ).then((querySnapshots) =>
                querySnapshots.flatMap((snapshot) => snapshot.docs.map((doc) => doc.data() as Book))
            );

            const sortedBooks = goodBooks.sort((a, b) => (b.Rating || 0) - (a.Rating || 0))

            const recommendedBooksRef = firestore.collection('Recommended book');

            const existingBooksSnapshot = await recommendedBooksRef.get();
            existingBooksSnapshot.forEach((doc) => {
                doc.ref.delete();
            });

            const recommendedBooks = sortedBooks.filter(
                (book) => book.Rating === sortedBooks[0].Rating
            )

            const index = Math.floor(Math.random() * recommendedBooks.length)
            const bestBook = recommendedBooks[index]

            await recommendedBooksRef.doc(bestBook.name).set(bestBook)
            setBestBook(bestBook)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button className={cls.newBookBtn} onClick={onShowModal}>Add new book</button>
            <BookModal isOpen={isModal} onClose={onCloseModal}/>
            <p className={cls.allBooksText}>All Books:</p>
            <BookList
                className={cls.list}
                books={books}
                isLoading={isLoading}
            />
            <p className={cls.recBooksText} style={{fontWeight: 700, fontSize: 30}}>Recommendation Book:</p>
            <BookListItem className={cls.recItem} book={bestBook} notDelete/>
        </div>
    )
}
