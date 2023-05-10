import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import App from './App';
import './index.scss';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);
