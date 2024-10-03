import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Weather from './components/Weather';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);  
    return (
        <Router>
            <div className="app">
            <ErrorBoundary>
                <Routes>
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
                    <Route path="/" element={<Register setLoggedIn={setLoggedIn} />} />
                    <Route path="/weather" element={<Weather />} />
                </Routes>
            </ErrorBoundary>
            </div>
        </Router>
    );
}

export default App;

