import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.routes.js'
import authRouter from './routes/auth.routes.js'
import cartRouter from './routes/cart.routes.js'
import { notFoundHandler, errorHandler } from './middlewares/error.js'

const app = express()

// 기본 미들웨어
app.use(cors({ origin: true }))   // FE 로컬 개발 허용
app.use(express.json())           // JSON 바디 파싱

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 라우터 묶기
app.use('/api/products', productsRouter)
app.use('/auth', authRouter)
app.use('/api/cart', cartRouter)

// 404 + 에러 핸들러 (맨 마지막)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
