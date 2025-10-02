import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('🔗 Supabase 연결 테스트')
console.log('URL:', supabaseUrl)
console.log('Key 존재:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    // 1. 기본 연결 테스트 - 간단한 쿼리
    console.log('\n1️⃣ 기본 연결 테스트...')

    // auth.users 테이블은 기본적으로 존재함
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (!usersError) {
      console.log('✅ Supabase 연결 성공!')
      console.log(`📊 등록된 사용자 수: ${users.users.length}`)
    } else {
      console.log('❌ Auth API 오류:', usersError.message)
    }

    // 2. public 스키마 테이블 탐색
    console.log('\n2️⃣ 테이블 존재 확인...')

    const tablesToCheck = [
      'products', 'users', 'categories', 'orders',
      'cart', 'cart_items', 'reviews', 'inventory'
    ]

    for (const table of tablesToCheck) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(0)

        if (!error) {
          console.log(`✅ ${table} 테이블 존재 (${count}개 행)`)

          // 스키마 정보 가져오기
          const { data: sample } = await supabase
            .from(table)
            .select('*')
            .limit(1)

          if (sample && sample.length > 0) {
            const columns = Object.keys(sample[0])
            console.log(`   컬럼: ${columns.join(', ')}`)
          }
        }
      } catch (e) {
        console.log(`❌ ${table} 테이블 없음 또는 접근 불가`)
      }
    }

  } catch (error) {
    console.error('💥 연결 테스트 실패:', error.message)
  }
}

testConnection()