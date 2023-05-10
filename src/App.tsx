import React, {createContext, useState} from 'react';
import './App.scss';
import {AppRouter} from "./app/providers/router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {Book} from "./entities/Book";

firebase.initializeApp(
    {
        apiKey: "AIzaSyC7j1dexyAk2jDu_Q0uMptGIZtC2Acy3Ic",
        authDomain: "books-react-8296d.firebaseapp.com",
        projectId: "books-react-8296d",
        storageBucket: "books-react-8296d.appspot.com",
        messagingSenderId: "59579915369",
        appId: "1:59579915369:web:6cc066aeb173d71e2096f8",
        measurementId: "G-KCB989ZE02"
    }
);

const firestore = firebase.firestore()

type ContextType = {
    firestore: firebase.firestore.Firestore;
    books: Book[];
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

export const Context = createContext<ContextType>({
    firestore: {} as firebase.firestore.Firestore,
    books: [],
    setBooks: () => {},
});

function App() {
    const [books, setBooks] = useState<Book[]>([]);

    return (
        <Context.Provider value={{
            firestore,
            books,
            setBooks
        }}>
            <div className="App">
                <div className='content-page'>
                    <AppRouter/>
                </div>
            </div>
        </Context.Provider>
    );
}

export default App;
