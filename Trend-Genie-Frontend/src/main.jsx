import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeContext } from './context/ThemeProvider';
import { UserProvider } from './context/userContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContext>
    <UserProvider>
      <App />
    </UserProvider>
    </ThemeContext>
  </React.StrictMode>
);