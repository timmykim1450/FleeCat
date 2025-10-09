import { runFullWorkflow } from './pm-workflow';

async function testPMWorkflow() {
  // 테스트 시나리오 1: 간단한 요구사항
  await runFullWorkflow('회원가입 페이지를 만들어줘');

  console.log('\n\n' + '🔄'.repeat(30) + '\n\n');

  // 테스트 시나리오 2: 구체적인 요구사항
  await runFullWorkflow(
    '사용자가 상품을 검색할 수 있는 UI를 만들어줘. 자동완성 기능이 있으면 좋겠어.'
  );
}

testPMWorkflow();