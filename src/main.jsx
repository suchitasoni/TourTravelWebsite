import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { TourProvider } from './TourContext.jsx';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  // If prerendered HTML exists → hydrate it
  ReactDOM.hydrateRoot(
    rootElement,
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>

  );
} else {
  // Normal React 18 createRoot
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
    <HelmetProvider>
      <TourProvider><App /></TourProvider>
    </HelmetProvider></BrowserRouter>
  );
}
