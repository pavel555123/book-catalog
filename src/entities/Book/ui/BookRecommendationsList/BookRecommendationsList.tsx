import cls from './BookRecommendationsList.module.css'
import { memo } from "react";
import { Book } from "../../types/book";
import { BookList } from "../BookList/BookList";

interface BookRecommendationsListProps {
    sortedBooks?: Book[]
    isLoading?: boolean
}

export const BookRecommendationsList = memo(({sortedBooks, isLoading}: BookRecommendationsListProps) => {

    if (!sortedBooks) {
        return (
            <div>Нет хороших книг</div>
        )
    }

    if (isLoading) {
        return (
            <div className={cls.ldsRing}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }

    console.log(sortedBooks, 'sorted')

    return (
        <div className={cls.BookRecommendationsList}>
            <p>Recommendations</p>
            <BookList books={sortedBooks} isLoading={false}/>
        </div>
    )
})
