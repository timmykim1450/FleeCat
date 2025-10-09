if (process.platform === 'win32') {
  process.stdout.setDefaultEncoding('utf-8');
}

import * as readlineSync from 'readline-sync';
import { runFullWorkflow } from './pm-workflow';
import * as fs from 'fs';
import * as path from 'path';

// CLI 상태 관리
interface CLIState {
  autoSave: boolean;
  history: string[];
}

const state: CLIState = {
  autoSave: true,
  history: [],
};

// 환영 메시지
function showWelcome() {
  console.clear();
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🤖 AI 팀 협업 시스템 v1.0              ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  console.log('AI 프론트엔드 + 백엔드 팀이 협업합니다.\n');
  console.log('명령어:');
  console.log('  📝 요구사항 입력     : 원하는 기능을 입력하세요');
  console.log('  📋 history          : 이전 작업 목록 보기');
  console.log('  💾 save on/off      : 자동 저장 켜기/끄기');
  console.log('  🔍 list             : 저장된 결과 파일 목록');
  console.log('  ❌ exit             : 종료');
  console.log('  🆘 help             : 도움말');
  console.log('\n' + '━'.repeat(47) + '\n');
}

// 도움말
function showHelp() {
  console.log('\n📚 사용 방법\n');
  console.log('1. 원하는 기능을 자연어로 입력하세요:');
  console.log('   예: "로그인 페이지를 만들어줘"');
  console.log('   예: "상품 검색 API 만들어줘"\n');
  console.log('2. AI 팀이 프론트엔드와 백엔드를 동시에 개발합니다.\n');
  console.log('3. 결과는 자동으로 output/ 폴더에 저장됩니다.\n');
}

// 히스토리 보기
function showHistory() {
  if (state.history.length === 0) {
    console.log('\n📭 아직 작업 내역이 없습니다.\n');
    return;
  }

  console.log('\n📜 작업 히스토리\n');
  state.history.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });
  console.log('');
}

// 저장된 파일 목록
function listSavedFiles() {
  const outputDir = path.join(process.cwd(), 'output');

  if (!fs.existsSync(outputDir)) {
    console.log('\n📂 아직 저장된 결과가 없습니다.\n');
    return;
  }

  const files = fs
    .readdirSync(outputDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse(); // 최신순

  if (files.length === 0) {
    console.log('\n📂 아직 저장된 결과가 없습니다.\n');
    return;
  }

  console.log(`\n📚 저장된 결과 (${files.length}개)\n`);

  files.slice(0, 10).forEach((file, i) => {
    // 최신 10개만
    const filePath = path.join(outputDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`${i + 1}. [${content.pmTask.priority}] ${content.userRequirement}`);
    console.log(`   📅 ${new Date(content.timestamp).toLocaleString('ko-KR')}`);
    console.log(`   📄 ${file}\n`);
  });

  if (files.length > 10) {
    console.log(`... 외 ${files.length - 10}개 더\n`);
  }
}

// 명령어 처리
async function handleCommand(input: string): Promise<boolean> {
  const trimmed = input.trim().toLowerCase();

  // 종료 명령
  if (trimmed === 'exit' || trimmed === 'quit' || trimmed === 'q') {
    console.log('\n👋 AI 팀 협업 시스템을 종료합니다. 안녕히 가세요!\n');
    return false;
  }

  // 도움말
  if (trimmed === 'help' || trimmed === 'h' || trimmed === '?') {
    showHelp();
    return true;
  }

  // 히스토리
  if (trimmed === 'history' || trimmed === 'hist') {
    showHistory();
    return true;
  }

  // 저장된 파일 목록
  if (trimmed === 'list' || trimmed === 'ls') {
    listSavedFiles();
    return true;
  }

  // 자동 저장 토글
  if (trimmed === 'save on') {
    state.autoSave = true;
    console.log('\n✅ 자동 저장이 활성화되었습니다.\n');
    return true;
  }

  if (trimmed === 'save off') {
    state.autoSave = false;
    console.log('\n❌ 자동 저장이 비활성화되었습니다.\n');
    return true;
  }

  // 빈 입력
  if (trimmed === '') {
    return true;
  }

  // 실제 요구사항 처리
  console.log('\n' + '═'.repeat(47));
  
  try {
    await runFullWorkflow(input.trim(), state.autoSave);
    state.history.push(input.trim());
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
  }

  console.log('═'.repeat(47) + '\n');
  return true;
}

// 메인 루프
async function main() {
  showWelcome();

  let running = true;

  while (running) {
    const input = readlineSync.question('\n💬 무엇을 만들까요?\n> ');
    running = await handleCommand(input);
  }
}

// 실행
main().catch((error) => {
  console.error('치명적 오류:', error);
  process.exit(1);
});