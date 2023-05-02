import React, { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp(
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

export const Context = createContext({})

const firestore = firebase.firestore()

const db = getFirestore(app);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Context.Provider value={{
        firebase,
        firestore,
        db
    }}>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </Context.Provider>
);
