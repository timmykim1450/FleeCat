// src/layouts/Layout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toastLoading, toastErr } from '../lib/toast'
import { useAuth } from '../contexts/AuthContext.jsx'

const linkStyle = ({ isActive }) => ({
  padding: '8px 12px',
  textDecoration: 'none',
  borderRadius: 8,
  fontWeight: 600,
  background: isActive ? '#eef' : 'transparent'
})

export default function Layout() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()   // ✅ 컨텍스트에서 상태/로그아웃

  const onLogout = async () => {
    try {
      await toastLoading(
        signOut(),                               // ✅ supabase 직접 호출 대신 컨텍스트 메서드
        { loading: '로그아웃 중…', success: '로그아웃 완료', error: '로그아웃 실패' }
      )
      navigate('/login', { replace: true })
    } catch (err) {
      toastErr(err?.message || String(err))
    }
  }

  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <NavLink to="/" style={linkStyle} end>홈</NavLink>
          <NavLink to="/products" style={linkStyle}>상품목록</NavLink>
          <NavLink to="/cart" style={linkStyle}>장바구니</NavLink>
          <div style={{ flex: 1 }} />

          {/* ✅ 로그인 상태 UI 반영 */}
          {loading ? (
            <span style={{ opacity: .6 }}>로그인 확인 중…</span>
          ) : user ? (
            <>
              <span style={{ fontWeight: 700 }}>{user.email}</span>
              <NavLink to="/account" style={linkStyle}>마이페이지</NavLink>
              <button onClick={onLogout} style={{ padding: '8px 12px' }}>로그아웃</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={linkStyle}>로그인</NavLink>
              <NavLink to="/signup" style={linkStyle}>회원가입</NavLink>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>

      <footer style={{ padding: 16, borderTop: '1px solid #ddd', textAlign: 'center' }}>
        © FE Skeleton
      </footer>
    </div>
  )
}
