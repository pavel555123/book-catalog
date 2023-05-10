import cls from './BookListItem.module.scss'
import {Book} from "../../types/book";
import {memo, useContext} from "react";
import {Context} from "App";
import {classNames} from "../../../../shared/lib/classNames/classNames";

interface BookListItemProps {
    className?: string
    book?: Book
    notDelete?: boolean
}

export const BookListItem = memo(({className, book, notDelete}: BookListItemProps) => {
        const {firestore, books, setBooks} = useContext(Context)

        const handleDelete = (bookName?: string, collectionName?: number) => {
            if (collectionName) {
                firestore.collection(collectionName.toString()).doc(book?.name).delete().then(() => {
                    const newBooks = books.filter((book: Book) => book.name !== bookName)
                    setBooks(newBooks)
                })
            } else {
                firestore.collection('Books without a year').doc(book?.name).delete().then(() => {
                    const newBooks = books.filter((book: Book) => book.name !== bookName)
                    setBooks(newBooks)
                })
            }
        }

        return (
            <div className={classNames(cls.BookListItem, {}, [className])}>
                {!notDelete
                    ?
                    <button className={cls.delete}
                            onClick={() => handleDelete(book?.name, book?.PublicationYear)}>&#10006;</button>
                    :
                    null
                }
                {book?.image
                    ?
                    <img className={cls.bookImage} src={book.image} alt='bookImage'/>
                    :
                    <img className={cls.bookImage}
                         src='https://media.gettyimages.com/id/471194615/nl/foto/antique-red-book.jpg?s=1024x1024&w=gi&k=20&c=qvyOHH-hS0M6g9vUawS6uvuI2VWs4X3rF5Vi1WmQ0Fw='
                         alt='notImage'
                    />}
                <p className={cls.text}>{book?.name}</p>
                <p className={cls.author}>{book?.Author}</p>
            </div>
        )
    }
)
