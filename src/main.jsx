import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      if (import.meta.env.DEV) {
        console.log('SW registered:', reg);
      }
    }).catch(err => {
      if (import.meta.env.DEV) {
        console.log('SW registration failed:', err);
      }
    });
  });
}
