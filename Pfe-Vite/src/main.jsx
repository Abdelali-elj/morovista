import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './composents/app';
import './css/index.css'
import './css/fonts.css'
import './css/comments.css'
import './i18n';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
)


