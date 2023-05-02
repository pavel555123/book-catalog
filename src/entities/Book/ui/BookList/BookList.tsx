import cls from './BookList.module.css'
import { BookListItem } from "../BookListItem/BookListItem";
import { memo } from "react";
import { Book } from "../../types/book";

interface BookListProps {
    books: Book[]
    isLoading?: boolean
}

export const BookList = memo(({books, isLoading}: BookListProps) => {

    const renderBook = (book: Book) => {
        return (
            <BookListItem
                book={book}
                key={book.name}
            />
        )
    }

    if (isLoading) {
        return (
            <div className={cls.BookList}>
                <div className={cls.ldsRing}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }

    return (
        <div className={cls.BookList}>
            {books.length > 0
                ? books.map(renderBook)
                : null
            }
        </div>
    )
})
