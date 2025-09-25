import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* 전역 토스터 */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: { fontSize: 14 }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
