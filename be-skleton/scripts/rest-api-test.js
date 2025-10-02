import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

async function testRestAPI() {
  try {
    console.log('🌐 Supabase REST API 직접 호출 테스트\n')

    // 1. OpenAPI 스키마 가져오기
    console.log('1️⃣ OpenAPI 스키마 조회...')
    const schemaResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    })

    if (schemaResponse.ok) {
      const schema = await schemaResponse.json()
      console.log('✅ API 스키마 조회 성공')

      // paths에서 테이블 목록 추출
      if (schema.paths) {
        const tables = Object.keys(schema.paths)
          .filter(path => path.startsWith('/') && !path.includes('{'))
          .map(path => path.replace('/', ''))
          .filter(table => table && !table.includes('rpc'))

        console.log('📋 발견된 테이블들:')
        tables.forEach(table => console.log(`  - ${table}`))

        // 2. 각 테이블의 스키마 확인
        console.log('\n2️⃣ 테이블 스키마 조회...')
        for (const table of tables.slice(0, 5)) { // 처음 5개만
          try {
            const tableResponse = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
              headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Prefer': 'count=exact'
              }
            })

            if (tableResponse.ok) {
              const data = await tableResponse.json()
              const count = tableResponse.headers.get('Content-Range')
              console.log(`✅ ${table}: ${data.length > 0 ? Object.keys(data[0]).join(', ') : '빈 테이블'} ${count || ''}`)
            }
          } catch (e) {
            console.log(`❌ ${table}: 접근 불가`)
          }
        }
      }
    } else {
      console.log('❌ API 스키마 조회 실패:', schemaResponse.status, schemaResponse.statusText)
    }

  } catch (error) {
    console.error('💥 REST API 테스트 실패:', error.message)
  }
}

testRestAPI()