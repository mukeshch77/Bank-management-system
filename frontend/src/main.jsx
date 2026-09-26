import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * main.jsx - The entry point of the React application.
 *
 * ReactDOM.createRoot() finds the <div id="root"> in index.html
 * and renders our entire React app inside it.
 *
 * React.StrictMode helps find problems during development
 * by intentionally running certain code twice (in dev mode only).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
