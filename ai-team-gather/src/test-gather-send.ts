import { GatherAPI } from './gather-api';
import * as dotenv from 'dotenv';

dotenv.config();

async function testSendMessage() {
  console.log('📤 Gather 메시지 전송 테스트\n');

  const gatherAPI = new GatherAPI({
    apiKey: process.env.GATHER_API_KEY || '',
    spaceId: process.env.GATHER_SPACE_ID || '',
  });

  try {
    console.log('메시지 전송 중...');
    
    await gatherAPI.sendChatMessage('🤖 AI 팀 테스트 메시지입니다!');
    
    console.log('\n✅ 전송 완료!');
    console.log('Gather 스페이스에서 메시지를 확인해보세요.\n');
    
  } catch (error) {
    console.error('\n❌ 전송 실패:', error);
  }
}

testSendMessage();