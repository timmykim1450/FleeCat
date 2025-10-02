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

console.log('🔍 Product 테이블 실제 스키마 확인')

async function getSchema() {
  try {
    // 첫 번째 행만 가져와서 컬럼 구조 파악
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ 오류:', error.message)
      return
    }

    if (data && data.length > 0) {
      console.log('✅ 테이블 접근 성공!')
      console.log('📋 실제 컬럼들:')

      const sample = data[0]
      Object.entries(sample).forEach(([key, value]) => {
        const type = value === null ? 'null' : typeof value
        console.log(`   ${key}: ${type}`)
      })

      console.log('\n📄 샘플 데이터:')
      console.log(JSON.stringify(sample, null, 2))
    } else {
      console.log('⚠️ 테이블이 비어있습니다')
    }
  } catch (e) {
    console.log('💥 예외:', e.message)
  }
}

getSchema()