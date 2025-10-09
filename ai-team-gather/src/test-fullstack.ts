import { runFullWorkflow } from './pm-workflow';

async function testWithSave() {
  // 테스트 시나리오 1: 저장 기능 포함
  await runFullWorkflow(
    '회원가입 API를 만들어줘. 이메일 중복 체크도 필요해.',
    true // 저장 활성화
  );

  console.log('\n\n' + '🔄'.repeat(30) + '\n\n');

  // 테스트 시나리오 2
  await runFullWorkflow(
    '상품 상세 페이지를 만들어줘. 이미지 슬라이더와 리뷰 섹션이 필요해.',
    true // 저장 활성화
  );
}

testWithSave();