import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const mainTables = [
  'product', 'category', 'shopping_cart', 'order',
  'member', 'company', 'payment', 'product_img'
]

async function getDetailedSchema() {
  console.log('🔍 상세 테이블 스키마 조회\n')

  for (const table of mainTables) {
    try {
      console.log(`📊 ${table.toUpperCase()} 테이블:`)

      // 샘플 데이터로 스키마 파악
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'count=exact'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const countHeader = response.headers.get('Content-Range')
        const totalCount = countHeader ? countHeader.split('/')[1] : '?'

        console.log(`   📈 총 ${totalCount}개 행`)

        if (data.length > 0) {
          const sample = data[0]
          console.log(`   🏗️  스키마:`)
          Object.entries(sample).forEach(([key, value]) => {
            const type = value === null ? 'null' : typeof value
            const displayValue = value === null ? 'NULL' :
                               typeof value === 'string' && value.length > 50 ?
                               value.substring(0, 50) + '...' : value
            console.log(`      ${key}: ${type} = ${displayValue}`)
          })
        } else {
          console.log(`   ⚠️  빈 테이블`)
        }
      } else {
        console.log(`   ❌ 접근 실패: ${response.status}`)
      }

      console.log('')
    } catch (error) {
      console.log(`   💥 오류: ${error.message}\n`)
    }
  }
}

getDetailedSchema()