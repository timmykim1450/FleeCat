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

async function introspectDatabase() {
  try {
    console.log('🔍 Supabase DB 스키마 조회 중...\n')

    // 1. 테이블 목록 조회
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_tables')
      .select()

    if (tablesError) {
      console.log('RPC 호출 실패, 직접 쿼리 시도...')

      // 2. information_schema로 테이블 목록 조회
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (schemaError) {
        console.log('information_schema 접근 실패, 알려진 테이블 시도...')

        // 3. 일반적인 테이블들 시도
        const commonTables = ['users', 'products', 'orders', 'categories', 'cart', 'cart_items']

        for (const table of commonTables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1)

            if (!error) {
              console.log(`✅ 테이블 발견: ${table}`)
              if (data && data.length > 0) {
                console.log(`   샘플 데이터:`, Object.keys(data[0]).join(', '))
              }
            }
          } catch (e) {
            // 테이블이 존재하지 않으면 무시
          }
        }
      } else {
        console.log('📋 발견된 테이블들:')
        schemaData?.forEach(table => {
          console.log(`  - ${table.table_name}`)
        })
      }
    } else {
      console.log('📋 테이블 목록:', tables)
    }

  } catch (error) {
    console.error('❌ DB 접근 오류:', error.message)
  }
}

introspectDatabase()