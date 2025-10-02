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

console.log('🧪 Product 테이블 접근 테스트')
console.log('=' .repeat(50))

async function testProductAccess() {
  try {
    console.log('1️⃣ product 테이블 접근 시도...')

    const { data, error, count } = await supabase
      .from('product')
      .select('*', { count: 'exact' })
      .limit(5)

    if (error) {
      console.log(`❌ product 테이블 오류: ${error.message}`)

      console.log('\n2️⃣ products 테이블 접근 시도...')
      const { data: data2, error: error2, count: count2 } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .limit(5)

      if (error2) {
        console.log(`❌ products 테이블도 오류: ${error2.message}`)
        return false
      } else {
        console.log(`✅ products 테이블 접근 성공!`)
        console.log(`📊 총 ${count2}개 행`)

        if (data2 && data2.length > 0) {
          console.log(`📋 컬럼들: ${Object.keys(data2[0]).join(', ')}`)
          console.log(`📄 첫 번째 데이터:`)
          console.log(JSON.stringify(data2[0], null, 2))
        } else {
          console.log(`⚠️  테이블이 비어있습니다`)
        }
        return true
      }
    } else {
      console.log(`✅ product 테이블 접근 성공!`)
      console.log(`📊 총 ${count}개 행`)

      if (data && data.length > 0) {
        console.log(`📋 컬럼들: ${Object.keys(data[0]).join(', ')}`)
        console.log(`📄 첫 번째 데이터:`)
        console.log(JSON.stringify(data[0], null, 2))
      } else {
        console.log(`⚠️  테이블이 비어있습니다`)
      }
      return true
    }

  } catch (exception) {
    console.log(`💥 예외 발생: ${exception.message}`)
    return false
  }
}

testProductAccess().then(success => {
  if (success) {
    console.log('\n🎉 DB 접근 성공! 백엔드 업데이트 가능합니다.')
  } else {
    console.log('\n🚫 아직 DB 접근 불가. RLS 설정 확인 필요.')
  }
})