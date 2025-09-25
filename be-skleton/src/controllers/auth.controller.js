export const signup = (req, res) => {
  const user = req.body || {}
  // TODO: 실제 DB 저장/검증은 Day 2
  return res.json({ message: '회원가입 성공', user })
}

export const login = (req, res) => {
  const { email, password } = req.body || {}
  // TODO: 실제 검증/JWT 발급은 Day 2
  if (!email || !password) {
    return res.status(400).json({ error: '이메일/비밀번호를 입력하세요' })
  }
  return res.json({ message: '로그인 성공', token: 'fake-jwt-token' })
}
