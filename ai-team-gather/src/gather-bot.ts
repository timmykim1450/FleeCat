import { Game } from '@gathertown/gather-game-client';
import { runFullWorkflow } from './pm-workflow';
import * as dotenv from 'dotenv';

dotenv.config();

// Space ID 변환 (/ → \)
const SPACE_ID = process.env.GATHER_SPACE_ID!.replace('/', '\\');
const API_KEY = process.env.GATHER_API_KEY!;

class AITeamBot {
  private game: Game;
  private isProcessing: boolean = false;

  constructor() {
    this.game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
  }

  async start() {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║   🤖 AI PM 봇 시작!                     ║');
    console.log('╚═══════════════════════════════════════════╝\n');
    console.log(`Space ID: ${SPACE_ID}\n`);

    // 연결 상태 모니터링
    this.game.subscribeToConnection((connected) => {
      if (connected) {
        console.log('✅ Gather에 연결되었습니다!\n');
      } else {
        console.log('❌ 연결이 끊어졌습니다. 재연결 중...\n');
      }
    });

    // Gather에 연결
    this.game.connect();

    // 봇 입장
    await this.enterSpace();

    // 채팅 리스너 등록
    this.setupChatListener();

    console.log('🎧 채팅 메시지를 기다리는 중...');
    console.log('💡 Gather에서 "@AI 로그인 만들어줘" 같은 메시지를 보내보세요!\n');
  }

  private async enterSpace() {
    try {
      await this.game.enter({
        name: 'AI PM 봇',
        // 아바타 설정 (선택사항)
        // textStatus: '무엇을 도와드릴까요?',
      });
      console.log('👤 PM 봇이 Gather에 입장했습니다.\n');
    } catch (error) {
      console.error('❌ 입장 실패:', error);
    }
  }

  private setupChatListener() {
    this.game.subscribeToEvent('playerChats', async (data, context) => {
      try {
        const senderId = data.senderId;
        const message = data.contents;
        
        // 자기 자신의 메시지는 무시
        if (senderId === this.game.getMyPlayer()?.id) {
          return;
        }

        console.log(`\n💬 메시지 수신: "${message}"`);

        // @AI 또는 @PM으로 시작하는 메시지만 처리
        if (message.startsWith('@AI') || message.startsWith('@PM')) {
          const requirement = message.replace(/^@(AI|PM)\s*/i, '').trim();

          if (!requirement) {
            this.game.chat('요구사항을 입력해주세요! 예: @AI 로그인 페이지 만들어줘');
            return;
          }

          if (this.isProcessing) {
            this.game.chat('지금 다른 작업 중입니다. 잠시만 기다려주세요...');
            return;
          }

          await this.processRequest(requirement);
        }
      } catch (error) {
        console.error('❌ 메시지 처리 오류:', error);
      }
    });
  }

  private async processRequest(requirement: string) {
    this.isProcessing = true;

    try {
      console.log(`\n🚀 작업 시작: ${requirement}`);
      
      // 작업 시작 알림
      this.game.chat(`작업을 시작합니다! 요구사항: ${requirement}`);

      // AI 팀 워크플로우 실행
      const result = await runFullWorkflow(requirement, true);

      // 결과 요약
      const summary = this.createSummary(result);
      
      // 결과를 여러 메시지로 분할해서 전송
      await this.sendMultipleMessages(summary);

      console.log('✅ 작업 완료 및 결과 전송 완료\n');

    } catch (error) {
      console.error('❌ 작업 실패:', error);
      this.game.chat('죄송합니다. 작업 중 오류가 발생했습니다.');
    } finally {
      this.isProcessing = false;
    }
  }

  private createSummary(result: any): string[] {
    return [
      `✅ 작업 완료!`,
      ``,
      `📌 PM 분석: ${result.pmTask.requirement}`,
      `🎯 우선순위: ${result.pmTask.priority}`,
      ``,
      `🎨 프론트엔드: ${result.frontendResult.summary}`,
      ``,
      `⚙️ 백엔드: ${result.backendResult.summary}`,
      ``,
      `💾 상세 결과는 output/ 폴더에 저장되었습니다.`
    ];
  }

  private async sendMultipleMessages(messages: string[]) {
    for (const msg of messages) {
      if (msg.trim()) {
        this.game.chat(msg);
        // 메시지 사이 딜레이 (Gather 제한 대비)
        await this.delay(800);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 봇 종료
  async stop() {
    console.log('\n👋 봇을 종료합니다...');
    this.game.disconnect();
  }
}

// 봇 실행
const bot = new AITeamBot();

bot.start().catch(error => {
  console.error('봇 시작 실패:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await bot.stop();
  process.exit(0);
});