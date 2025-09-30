import { NavLink, useNavigate } from 'react-router-dom'
import { toastLoading, toastErr } from '../../lib/toast'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/Layout.css'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()

  const onLogout = async () => {
    try {
      await toastLoading(
        signOut(),
        { loading: '로그아웃 중…', success: '로그아웃 완료', error: '로그아웃 실패' }
      )
      navigate('/login', { replace: true })
    } catch (err) {
      toastErr(err?.message || String(err))
    }
  }

  return (
    <header className="header">
      <div className="wrap">
        <div className="header__inner">
          {/* 왼쪽: 앱 설치 */}
          <div className="header__left">
            <a href="#" className="header__link">앱 설치</a>
          </div>

          {/* 오른쪽: 로그인 상태에 따른 링크들 */}
          <div className="header__right">
            {loading ? (
              <span className="header__loading">로그인 확인 중…</span>
            ) : user ? (
              <>
                <span className="header__user-info">{user.email}</span>
                <button className="header__button" onClick={onLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <a href="#" className="header__link">고객센터</a>
                <NavLink to="/login" className="header__link">로그인</NavLink>
                <NavLink to="/signup" className="header__link header__link--signup">회원가입</NavLink>
              </>
            )}
            {user && <a href="#" className="header__link">고객센터</a>}
          </div>
        </div>
      </div>
    </header>
  )
}