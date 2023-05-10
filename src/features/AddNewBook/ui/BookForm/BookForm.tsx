import cls from './BookForm.module.scss'
import {memo, useContext} from "react";
import {classNames} from "shared/lib/classNames/classNames";
import {Context} from "App";
import {useForm} from 'react-hook-form';
import {Book} from "entities/Book";

interface BookFormProps {
    className?: string
}

export const BookForm = memo(({className}: BookFormProps) => {

    const {firestore, books, setBooks} = useContext(Context)
    const {register, handleSubmit, reset, formState: {errors}} = useForm<Book>()
    const onSubmit = (data: Book) => {
        const booksRef = String(data.PublicationYear) === '' ? firestore.collection('Books without a year') : firestore.collection(String(data.PublicationYear))
        const docRef = booksRef.doc(data.name)
        const bookData: Book = {
            name: data.name,
            Author: data.Author
        }
        if (String(data.PublicationYear) !== '') {
            bookData.PublicationYear = Number(data.PublicationYear)
        }
        if (String(data.Rating) !== '') {
            bookData.Rating = Number(data.Rating);
        }
        if (data.image !== '') {
            bookData.image = data.image
        }
        if (data.ISBN !== '') {
            bookData.ISBN = data.ISBN;
        }

        docRef.set(bookData)
            .then(() => {
                console.log('Document written with ID: ', docRef.id)
                setBooks([...books, bookData])
            })
            .catch((error: any) => {
                console.error('Error adding document: ', error)
            })
        reset()
    }

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
                    {...register('PublicationYear', {pattern: /^(2015|2018|2020)$/,})}
                />
            </label>
            {errors.PublicationYear && <span className={cls.error}>Please enter 2015, 2018 or 2020</span>}
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
