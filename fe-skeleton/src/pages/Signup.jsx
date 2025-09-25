import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toastOk, toastErr, toastLoading } from '../lib/toast'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
  e.preventDefault()
  setMsg('')

  const emailTrim = email.trim().toLowerCase()
  const passTrim  = password.trim()
  if (!emailTrim || !passTrim) return toastErr('이메일/비밀번호를 입력하세요')
  if (passTrim.length < 6)     return toastErr('비밀번호는 6자 이상')

  setLoading(true)
  try {
    await toastLoading(
      supabase.auth.signUp({ email: emailTrim, password: passTrim }),
      {
        loading: '가입 처리중…',
        success: '회원가입 성공! (인증 메일을 확인하세요)',
        error: '회원가입 실패'
      }
    ).then(({ data, error }) => {
      if (error) throw error
    })
    navigate('/account', { replace: true })
  } catch (err) {
    toastErr(err)
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="비밀번호" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading}>{loading ? '처리중...' : '회원가입'}</button>
        {msg && <p>{msg}</p>}
      </form>
      <p>이미 계정이 있나요? <Link to="/login">로그인</Link></p>
    </>
  )
}
