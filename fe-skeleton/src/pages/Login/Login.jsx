import { useRef, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { toastOk, toastErr } from '../../lib/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/account'
  const pwRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()

    const emailTrim = email.trim().toLowerCase()
    const passTrim  = password.trim()
    if (!emailTrim || !passTrim) return toastErr('이메일/비밀번호를 입력하세요')

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailTrim,
        password: passTrim,
      })

      if (error) {
        if (error.message === 'Email not confirmed') {
          toastErr('이메일 인증이 필요합니다 📩')
        } else if (error.message === 'Invalid login credentials') {
          toastErr('이메일/비밀번호가 올바르지 않습니다')
        } else {
          toastErr(error)
        }
        setPassword('')
        pwRef.current?.focus()
        return
      }

      toastOk('로그인 성공!')
      navigate(from, { replace: true })
    } catch (err) {
      // 네트워크/기타 예외
      toastErr('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>로그인</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          autoComplete="email"
          placeholder="이메일"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          ref={pwRef}
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button disabled={loading}>{loading ? '처리중...' : '로그인'}</button>
      </form>
      <p>아직 계정이 없나요? <Link to="/signup">회원가입</Link></p>
    </>
  )
}
