// src/layouts/Layout.jsx
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import BodyHeader from '../components/BodyHeader'
import '../styles/Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <BodyHeader />

      <main className="layout__main">
        <div className="wrap">
          <Outlet />
        </div>
      </main>

      <footer className="layout__footer">
        <div className="wrap">
          © FE Skeleton
        </div>
      </footer>
    </div>
  )
}
