import React, { useContext, useState } from 'react';
import { Context } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Book } from "../../entities/Book";

export function Counter() {

    // @ts-ignore
    const {firebase, firestore, db} = useContext(Context)
    console.log(db)

    const sendBook = async () => {
        // firestore.collection('2018').add(
        //     {
        //     name: "The Inmates Are Running the Asylum",
        //     Author: " Cooper, Alan",
        //     PublicationYear: 2018,
        //     Rating: 3,
        //     ISBN: "978-00624565672",
        //     image: 'https://cdn.img-gorod.ru/200x280/nomenclature/29/798/2979841.jpg'
        // })
        firestore.setDoc(firestore.doc(db, "books"), {
            name: "The Inmates Are Running the Asylum",
            Author: "Cooper, Alan",
            PublicationYear: 2020,
            Rating: 8,
            ISBN: "978-0672326141",
            image: 'https://cdn.img-gorod.ru/200x280/nomenclature/29/798/2979840.jpg'
        });
    }

    const sendDoc = async () => {
        await firestore.addDoc(firestore.collection(db, "2018", "Book Q"), {
            first: "Alan",
            middle: "Mathison",
            last: "Turing",
            born: 1912
        });
    }

    const fun = () => {
        const booksRef = firebase.firestore().collection('books');

// создаем ссылку на новый документ с заданным именем
        const docRef = booksRef.doc('Book L');

// добавляем данные в документ
        docRef.set({
            name: "Press Reset: Ruin and Recovery in the Video Game Industry",
            Author: "Jason Schreier",
            PublicationYear: 2020,
            Rating: 10,
            image: 'https://cdn.img-gorod.ru/200x280/nomenclature/29/797/2979798.jpg'
        })
            .then(() => {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch((error: any) => {
                console.error('Error adding document: ', error);
            });
    }

    const fun2 = () => {
        const bookRef = firestore.collection('books').doc('Book L');
        bookRef.delete()
            .then(() => {
                console.log('Book deleted successfully');
            })
            .catch((error: any) => {
                console.error('Error deleting book: ', error);
            });
    }

    const fun3 = () => {
        // const booksRef = firestore.collection('2020');
        //
        // booksRef.get().then((querySnapshot: any[]) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data().PublicationYear}`);
        //     });
        // }).catch((error: any) => {
        //     console.error('Error getting books: ', error);
        // });
        const collectionNames = ['2020', '2018', '2015'];
        const promises = collectionNames.map((collectionName) => {
            return firestore.collection(collectionName).get();
        });

        Promise.all(promises).then((querySnapshots) => {
            querySnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc: { id: any; data: () => Book; }) => {
                    console.log(doc.id, ' => ', doc.data().PublicationYear);
                });
            });
        });
    }

    return (
        <div>
            {/*<button*/}
            {/*    onClick={sendBook}*/}
            {/*>*/}
            {/*    book*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={sendDoc}*/}
            {/*>*/}
            {/*    doc*/}
            {/*</button>*/}
            <button
                onClick={fun}
            >
                new
            </button>
            <button
                onClick={fun2}
            >
                delete
            </button>
            <button
                onClick={fun3}
            >
                list
            </button>
        </div>
    );
}
