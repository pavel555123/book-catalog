import { BookList } from "../../../entities/Book/ui/BookList/BookList";
import { Book } from "../../../entities/Book";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../index";
import { BookRecommendationsList } from "../../../entities/Book/ui/BookRecommendationsList/BookRecommendationsList";
import { Counter } from "../../../features/counter/Counter";

export const MainPage = () => {
    // @ts-ignore
    const {firestore} = useContext(Context)
    const [books, isLoading] = useCollectionData(
        firestore.collection('2020').orderBy('PublicationYear')
    )
    const goodBooksRef = firestore.collection('books')
        .where('PublicationYear', '>=', 2020)
        .orderBy('PublicationYear', 'desc')
        // .orderBy('Rating', 'desc')

    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

    useEffect(() => {
        getRecommendedBooks(3).then((books) => {
            setRecommendedBooks(books);
        });
    }, []);

    function getRecommendedBooks(numBooks: number): Promise<Book[]> {
        return goodBooksRef.get().then((querySnapshot: any[]) => {
            const goodBooks: Book[] = [];
            querySnapshot.forEach((doc) => {
                goodBooks.push(doc.data());
            });

            const recommendedBooks: Book[] = [];
            while (recommendedBooks.length < numBooks && goodBooks.length > 0) {
                const index = Math.floor(Math.random() * goodBooks.length);
                const book = goodBooks.splice(index, 1)[0];
                recommendedBooks.push(book);
            }

            return recommendedBooks;
        });
    }

    interface GroupedByYear {
        [year: string]: Book[];
    }

    function groupByYear(books: Book[]) {
        const grouped: GroupedByYear = books.reduce((acc: GroupedByYear, book) => {
            const year = book.PublicationYear || 'No year';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(book);
            return acc;
        }, {});
        // console.log(grouped, 'grouped')
        const sortedGrouped: GroupedByYear = {};

        Object.keys(grouped)
            .sort((a, b) => Number(b) - Number(a))
            .forEach((year) => {
                sortedGrouped[year] = grouped[year].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            });
        // console.log(sortedGrouped[2015], 'sortedGrouped')

        return sortedGrouped;
    }

    // if (books) {
    //     groupByYear(books as Book[])
    // }

    return (
        <div>
            {/*<button onClick={() => groupByYear}>123</button>*/}
            {/*{goodBooksRef.map(item => <div>{item.name} {item.PublicationYear}</div>)}*/}
            <BookList
                // className={cls.list}
                books={books as Book[]}
                isLoading={isLoading}
            />
            <BookRecommendationsList sortedBooks={recommendedBooks}/>
            <Counter/>
        </div>
    )
}
