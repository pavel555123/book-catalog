import React from 'react';
import './App.css';
import { AppRouter } from "./app/providers/router";

function App() {
    return (
        <div className="App">
            <div className='content-page'>
                <AppRouter/>
            </div>
        </div>
    );
}

export default App;
