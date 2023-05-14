import {memo} from "react";
import {Modal} from "shared/ui/Modal/Modal";
import {classNames} from "shared/lib/classNames/classNames";
import {BookForm} from "../BookForm/BookForm";
import {Book} from "entities/Book";
import { EditBookForm } from "../../../EditBookForm/EditBookForm";

interface BookModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    book?: Book
}

export const BookModal = memo(({className, isOpen, onClose, book}: BookModalProps) => {

    return (
        <Modal
            className={classNames('', {}, [className])}
            isOpen={isOpen}
            onClose={onClose}
            lazy
        >
            {!book ? <BookForm/> : <EditBookForm book={book}/>}
        </Modal>
    )
})
