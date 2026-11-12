import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlassProvider, ToastProvider } from 'liquidglass-ui';
import 'liquidglass-ui/styles.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlassProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </GlassProvider>
    </BrowserRouter>
  </React.StrictMode>
);
