import express from 'express';
import bodyParser from 'body-parser';
import { runFullWorkflow } from './pm-workflow';
import { GatherAPI } from './gather-api';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Gather API 초기화
const gatherAPI = new GatherAPI({
  apiKey: process.env.GATHER_API_KEY || '',
  spaceId: process.env.GATHER_SPACE_ID || '',
});

app.use(bodyParser.json());

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Team Server is running' });
});

// Gather 웹훅 수신
app.post('/webhook/gather', async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log('📨 Gather 이벤트 수신:', event);

    // 채팅 메시지 이벤트 처리
    if (event === 'chat.message') {
      const { message, userId, userName } = data;

      console.log(`💬 ${userName}: ${message}`);

      // @AI 또는 @PM으로 시작하는 메시지만 처리
      if (message.startsWith('@AI') || message.startsWith('@PM')) {
        const requirement = message.replace(/^@(AI|PM)\s*/i, '').trim();

        if (!requirement) {
          await gatherAPI.sendChatMessage('요구사항을 입력해주세요! 예: @AI 로그인 페이지 만들어줘');
          res.sendStatus(200);
          return;
        }

        // 작업 시작 알림
        await gatherAPI.sendChatMessage(`🚀 AI 팀이 작업을 시작합니다...\n📋 요구사항: ${requirement}`);

        // AI 팀 워크플로우 실행
        const result = await runFullWorkflow(requirement, true);

        // 결과 요약 전송
        const summary = formatResultForGather(result);
        await gatherAPI.sendLongMessage(summary);

        // 상세 결과는 파일로 저장되었다고 안내
        await gatherAPI.sendChatMessage(
          '✅ 작업 완료! 상세 결과는 output/ 폴더에 저장되었습니다.'
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ 웹훅 처리 오류:', error);
    
    try {
      await gatherAPI.sendChatMessage('⚠️ 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } catch (sendError) {
      console.error('오류 메시지 전송 실패:', sendError);
    }
    
    res.sendStatus(500);
  }
});

// 결과를 Gather용으로 포맷팅
function formatResultForGather(result: any): string {
  const lines: string[] = [];

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📊 AI 팀 협업 결과');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // PM 분석
  lines.push('');
  lines.push('👔 PM 분석');
  lines.push(`📌 ${result.pmTask.requirement}`);
  lines.push(`🎯 우선순위: ${result.pmTask.priority}`);
  
  // 프론트엔드 결과
  lines.push('');
  lines.push('🎨 프론트엔드 결과');
  lines.push(`✨ ${result.frontendResult.summary}`);
  
  // 백엔드 결과
  lines.push('');
  lines.push('⚙️ 백엔드 결과');
  lines.push(`✨ ${result.backendResult.summary}`);
  
  if (result.backendResult.apiSpec) {
    lines.push('');
    lines.push('📡 API 스펙');
    lines.push(result.backendResult.apiSpec.substring(0, 200) + '...');
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('💡 전체 코드는 output/ 폴더를 확인하세요!');

  return lines.join('\n');
}

// 서버 시작
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🤖 AI 팀 Gather 서버 시작!            ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  console.log(`🌐 서버 주소: http://localhost:${PORT}`);
  console.log(`📡 웹훅 엔드포인트: http://localhost:${PORT}/webhook/gather`);
  console.log('\n대기 중...\n');
});