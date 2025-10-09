import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function testGatherConnection() {
  console.log('🔍 Gather API 연결 테스트 시작...\n');

  const apiKey = process.env.GATHER_API_KEY;
  const spaceId = process.env.GATHER_SPACE_ID;

  // 1. 환경변수 확인
  console.log('📋 설정 확인:');
  console.log(`  API Key: ${apiKey ? `✅ 설정됨 (${apiKey.substring(0, 10)}...)` : '❌ 없음'}`);
  console.log(`  Space ID: ${spaceId ? '✅ 설정됨' : '❌ 없음'}`);

  if (!apiKey || !spaceId) {
    console.log('\n❌ .env 파일에 GATHER_API_KEY와 GATHER_SPACE_ID를 설정해주세요!');
    return;
  }

  // 2. 여러 API 엔드포인트 시도
  const endpoints = [
    {
      name: 'API v2 - spaces',
      url: `https://api.gather.town/api/v2/spaces/${spaceId}`,
      method: 'GET'
    },
    {
      name: 'API v2 - spaces 목록',
      url: `https://api.gather.town/api/v2/spaces`,
      method: 'GET'
    },
    {
      name: 'Gather HTTP API',
      url: `https://gather.town/api/v2/spaces/${spaceId}`,
      method: 'GET'
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🌐 테스트 중: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);

    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('   ✅ 성공!');
      console.log(`   응답 데이터:`, JSON.stringify(response.data, null, 2).substring(0, 500));
      console.log('\n🎉 이 엔드포인트를 사용하세요!\n');
      return;

    } catch (error: any) {
      if (error.response) {
        console.log(`   ❌ 실패 - 상태코드: ${error.response.status}`);
        console.log(`   메시지: ${JSON.stringify(error.response.data).substring(0, 200)}`);
      } else if (error.request) {
        console.log(`   ❌ 실패 - 요청이 전송되었으나 응답 없음`);
      } else {
        console.log(`   ❌ 실패 - ${error.message}`);
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 모든 엔드포인트 실패. 다음을 확인하세요:');
  console.log('   1. API 키가 올바른가요?');
  console.log('   2. Space ID 형식이 맞나요?');
  console.log('   3. API 키에 필요한 권한이 있나요?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testGatherConnection();