import { callLLM } from './llm';

async function testBasic() {
  console.log('🤖 LLM 테스트 시작...\n');

  const systemPrompt = '당신은 프론트엔드 개발자입니다. 간결하게 답변하세요.';
  const userPrompt = 'React로 간단한 로그인 폼을 만드는 코드를 20줄 이내로 작성해주세요.';

  const response = await callLLM(systemPrompt, userPrompt);

  console.log('📝 응답:\n');
  console.log(response);
  console.log('\n✅ 테스트 완료!');
}

testBasic();