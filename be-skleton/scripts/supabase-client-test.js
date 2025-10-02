import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const tables = ['product', 'category', 'shopping_cart', 'order', 'member']

async function testSupabaseClient() {
  console.log('🧪 Supabase 클라이언트로 테이블 접근 테스트\n')

  for (const table of tables) {
    try {
      console.log(`🔍 ${table} 테이블 테스트:`)

      // 1. 기본 select
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`   ❌ Select 오류: ${error.message}`)

        // 2. count만 시도
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.log(`   ❌ Count 오류: ${countError.message}`)
        } else {
          console.log(`   ✅ Count 성공: ${count}개 행`)
        }
      } else {
        console.log(`   ✅ Select 성공: ${data.length}개 행`)
        if (data.length > 0) {
          console.log(`   📋 컬럼: ${Object.keys(data[0]).join(', ')}`)
          console.log(`   📄 샘플:`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...')
        }
      }
      console.log('')
    } catch (error) {
      console.log(`   💥 예외: ${error.message}\n`)
    }
  }

  // 3. 테이블 생성 권한 테스트
  console.log('🛠️ 테이블 생성 권한 테스트:')
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1)

    console.log('Test table query result:', { data, error: error?.message })
  } catch (e) {
    console.log('Test table error:', e.message)
  }
}

testSupabaseClient()