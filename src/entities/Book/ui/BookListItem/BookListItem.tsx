import cls from './BookListItem.module.css'
import { Book } from "../../types/book";
import { memo } from "react";

interface BookListItemProps {
    book: Book
}

export const BookListItem = memo(({ book }: BookListItemProps) => {
    return (
        <div className={cls.BookListItem}>
            <img className={cls.bookImage} src={book.image} alt='bookImage'/>
            <p className={cls.text}>{book.name}</p>
            <p className={cls.author}>{book.Author}</p>
            {/*<p>{book.PublicationYear}</p>*/}
        </div>
    )
})
