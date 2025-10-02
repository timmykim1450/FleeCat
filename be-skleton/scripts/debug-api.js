import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// Supabase 클라이언트 테스트
console.log('🔧 API 디버깅 시작')
console.log('ENV 확인:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✅' : '❌'
})

// 1. Supabase 클라이언트 import 테스트
try {
  const { supabase } = await import('../src/lib/supabase.js')
  console.log('✅ Supabase 클라이언트 import 성공')

  // 2. 간단한 연결 테스트
  try {
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ DB 쿼리 오류:', error.message)
      console.log('오류 코드:', error.code)
      console.log('오류 상세:', error.details)
    } else {
      console.log('✅ DB 쿼리 성공:', data?.length || 0, '개 행')
    }
  } catch (dbError) {
    console.log('💥 DB 연결 예외:', dbError.message)
  }

} catch (importError) {
  console.log('❌ Supabase 클라이언트 import 실패:', importError.message)
}

// 3. Controller 함수 직접 테스트
try {
  const { getProducts } = await import('../src/controllers/products.controller.js')
  console.log('✅ Controller import 성공')

  // Mock request/response 객체
  const mockReq = {}
  const mockRes = {
    json: (data) => console.log('📤 응답 데이터:', data),
    status: (code) => ({
      json: (data) => console.log(`📤 응답 (${code}):`, data)
    })
  }

  console.log('🧪 Controller 함수 직접 실행...')
  await getProducts(mockReq, mockRes)

} catch (controllerError) {
  console.log('❌ Controller 테스트 실패:', controllerError.message)
  console.log('스택:', controllerError.stack)
}