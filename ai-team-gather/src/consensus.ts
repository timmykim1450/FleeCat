import { callLLM } from './llm';
import { Agent } from './agents';

export async function teamConsensus(
  agents: Agent[],
  task: string,
  arbiterAgent: Agent
): Promise<any> {
  console.log(`\n🔄 ${agents.length}명의 에이전트가 토론을 시작합니다...\n`);

  // 1단계: 각 에이전트에게서 제안 받기
  const proposals: string[] = [];
  
  for (const agent of agents) {
    console.log(`  💭 ${agent.role}이(가) 생각 중...`);
    const proposal = await callLLM(agent.systemPrompt, task);
    proposals.push(proposal);
    console.log(`  ✓ ${agent.role} 제안 완료\n`);
  }

  // 2단계: 심판자에게 합의 요청
  console.log(`\n⚖️  심판자가 제안들을 검토합니다...\n`);
  
  const arbiterPrompt = `
다음은 같은 작업에 대한 ${proposals.length}개의 제안입니다:

${proposals.map((p, i) => `
=== 제안 ${i + 1} ===
${p}
`).join('\n')}

이 제안들을 종합하여 최종안을 만들어주세요.
반드시 순수 JSON 형식으로만 출력하세요 (코드 블록 없이):
{
  "summary": "핵심 결정사항을 3줄로 요약",
  "codeSketch": "통합된 최종 코드 (주석 포함)",
  "risks": ["예상되는 리스크 2-3개"]
}
`;

  const finalDecision = await callLLM(arbiterAgent.systemPrompt, arbiterPrompt);
  
  // JSON 파싱 (백틱 제거 포함)
  try {
    // ```json 또는 ``` 제거
    const cleanedJson = finalDecision
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.warn('⚠️  JSON 파싱 실패, 원본 텍스트 반환');
    // 파싱 실패해도 텍스트 그대로 구조화
    return {
      summary: '파싱 실패 - 아래 원본 참조',
      codeSketch: finalDecision,
      risks: ['JSON 형식 파싱 실패'],
    };
  }
}