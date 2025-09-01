import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Ensure this import exists
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/team-sports-shell/"> {/* Add this basename prop */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
