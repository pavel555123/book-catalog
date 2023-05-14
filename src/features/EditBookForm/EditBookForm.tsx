import {memo, useContext, useEffect} from "react";
import {Book} from "entities/Book";
import {Context} from "App";
import {classNames} from "../../shared/lib/classNames/classNames";
import cls from "../AddNewBook/ui/BookForm/BookForm.module.scss";
import {useForm} from "react-hook-form";
import {collectionRefs, fetchBooks} from "entities/Book/services/getBooks";

interface BookEditFormProps {
    className?: string
    book: Book
}

export const EditBookForm = memo(({className, book}: BookEditFormProps) => {

    const {firestore, books, setBooks} = useContext(Context);
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<Book>();

    useEffect(() => {
        if (book) {
            setValue('name', book.name);
            setValue('Author', book.Author);
            setValue('PublicationYear', book.PublicationYear);
            setValue('Rating', book.Rating);
            setValue('image', book.image);
            setValue('ISBN', book.ISBN);
        }
    }, [book, setValue]);

    const onSubmit = async (data: Book) => {
        const booksRef = !book.PublicationYear ? firestore.collection('Books without a year') : firestore.collection(String(book.PublicationYear))
        const docRef = booksRef.doc(book.name)

        const bookData: Book = {
            name: data.name,
            Author: data.Author
        }

        if (data.Rating) {
            bookData.Rating = Number(data.Rating)
        } else {
            delete bookData.Rating
        }

        if (data.image) {
            bookData.image = data.image
        } else {
            delete bookData.image
        }

        if (data.ISBN) {
            bookData.ISBN = data.ISBN
        } else {
            delete bookData.ISBN
        }

        if (data.PublicationYear !== book.PublicationYear) {
            if (data.PublicationYear) {
                bookData.PublicationYear = Number(data.PublicationYear)
                const newBooksCollection = firestore.collection(String(data.PublicationYear))
                await newBooksCollection.doc(data.name).set(bookData);
            } else {
                delete bookData.PublicationYear
                const newBooksCollection = firestore.collection('Books without a year')
                await newBooksCollection.doc(data.name).set(bookData)
            }
            await docRef.delete()
        } else if (data.name !== book.name) {
            await booksRef.doc(data.name).set(bookData)
            await docRef.delete()
        } else {
            bookData.PublicationYear = Number(data.PublicationYear)
            await booksRef.doc(data.name).set(bookData)
        }

        try {
            console.log('Document updated:', docRef.id)
            const updatedBooks = books.map((b) => (b.name === book.name ? {...b, ...bookData} : b));
            setBooks(updatedBooks)

            const collectionRefsArray = await collectionRefs(firestore)
            const fetchedBooks = await fetchBooks(collectionRefsArray)

            if (localStorage.getItem('isRating') === 'true') {
                fetchedBooks.sort((a, b) => (b.Rating || 0) - (a.Rating || 0))
            }
            if (localStorage.getItem('isAuthor') === 'true') {
                fetchedBooks.sort((a, b) =>
                    a.Author.localeCompare(b.Author, undefined, {sensitivity: 'base'})
                );
            }

            setBooks(fetchedBooks)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    };

    return (
        <form className={classNames(cls.BookForm, {}, [className])} onSubmit={handleSubmit(onSubmit)}>
            <label>
                Title:
                <input
                    className={cls.input}
                    {...register('name', {required: true})}
                    maxLength={100}
                />
            </label>
            {errors.name && <span className={cls.error}>This field is required</span>}
            <label>
                Authors:
                <input
                    className={cls.input}
                    {...register('Author', {required: true})}
                />
            </label>
            {errors.Author && <span className={cls.error}>This field is required</span>}
            <label>
                Publication Year:
                <input
                    className={cls.input}
                    {...register('PublicationYear', {
                        pattern: /^[1-9]\d{3}$/,
                        validate: (value) => {
                            if (!value) {
                                return true
                            }
                            const year = Number(value);
                            return year >= 1800 && year <= new Date().getFullYear()
                        },
                    })}
                />
            </label>
            {errors.PublicationYear && <span className={cls.error}>Enter a year between 1800 and 2023</span>}
            <label>
                Rating:
                <input
                    className={cls.input}
                    {...register('Rating', {pattern: /^(10|[0-9])$/})}
                />
            </label>
            {errors.Rating && <span className={cls.error}>Invalid rating</span>}
            <label>
                Image:
                <input
                    className={cls.input}
                    {...register('image', {
                        pattern: /^(ftp|http|https):\/\/[^ "]+$/
                    })} />
            </label>
            {errors.image && errors.image.type === "pattern" && (
                <span className={cls.error}>Invalid Link</span>
            )}
            <label>
                ISBN:
                <input
                    className={cls.input}
                    {...register('ISBN', {pattern: /^(?:\d{3}-)?\d{10}$/})}
                />
            </label>
            {errors.ISBN && <span className={cls.error}>Invalid ISBN</span>}
            <input type='submit' className={cls.bookBtn}/>
        </form>
    )
})


