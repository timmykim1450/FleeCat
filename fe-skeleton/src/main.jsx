import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from './providers/QueryProvider'

/**
 * Enable MSW in development mode
 */
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'warn'
    })
  }
}

/**
 * Start app after MSW is ready
 */
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryProvider>
          <App />
          {/* 전역 토스터 */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: { fontSize: 14 }
            }}
          />
        </QueryProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
