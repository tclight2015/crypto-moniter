import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { activeConfig } from './config/index.js';
import { applyTheme } from './theme/applyTheme.js';
import './index.css';

applyTheme(activeConfig.colorTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
