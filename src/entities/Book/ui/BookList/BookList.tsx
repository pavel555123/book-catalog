import cls from './BookList.module.scss'
import {BookListItem} from "../BookListItem/BookListItem";
import {memo} from "react";
import {Book} from "../../types/book";
import {classNames} from "../../../../shared/lib/classNames/classNames";

interface BookListProps {
    className?: string
    books: Book[]
    isLoading: boolean
}

export const BookList = memo(({className, books, isLoading}: BookListProps) => {
    const renderBook = (book: Book) => {
        return (
            <BookListItem
                book={book}
                key={book.name}
            />
        )
    }

    if (isLoading) {
        const placeholders = new Array(12).fill(null)

        return (
            <div className={classNames(cls.BookList, {}, [className])}>
                {placeholders.map((_, index) => (
                    <div key={index} className={cls.BookListItem}>
                        <div className={cls.ldsRing}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={classNames(cls.BookList, {}, [className])}>
            {books.length > 0
                ? books.map(renderBook)
                : null
            }
        </div>
    )
})
