import {memo} from "react";
import {Modal} from "shared/ui/Modal/Modal";
import {classNames} from "shared/lib/classNames/classNames";
import {BookForm} from "../BookForm/BookForm";

interface BookModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
}

export const BookModal = memo(({className, isOpen, onClose}: BookModalProps) => {

    return (
        <Modal
            className={classNames('', {}, [className])}
            isOpen={isOpen}
            onClose={onClose}
            lazy
        >
            <BookForm/>
        </Modal>
    )
})
