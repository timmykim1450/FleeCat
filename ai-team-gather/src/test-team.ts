import { teamConsensus } from './consensus';
import { frontendAgents, arbiter } from './agents';

async function testTeamConsensus() {
  console.log('🎯 팀 합의 테스트 시작!\n');
  console.log('━'.repeat(60));

  const task = `
React로 로그인 폼을 만들어주세요.
요구사항:
- 이메일과 비밀번호 입력 필드
- 유효성 검사 (이메일 형식, 비밀번호 6자 이상)
- 에러 메시지 표시
- 제출 버튼
`;

  const result = await teamConsensus(frontendAgents, task, arbiter);

  console.log('\n📊 최종 결과');
  console.log('━'.repeat(60));
  console.log('\n✨ 요약:');
  console.log(result.summary);
  console.log('\n📝 코드:');
  console.log(result.codeSketch);
  console.log('\n⚠️  리스크:');
  result.risks?.forEach((risk: string, i: number) => {
    console.log(`  ${i + 1}. ${risk}`);
  });
  console.log('\n✅ 테스트 완료!');
}

testTeamConsensus();