import { callLLM } from './llm';
import { teamConsensus } from './consensus';
import {
  pmAgent,
  frontendAgents,
  arbiter,
  backendAgents,
  backendArbiter,
} from './agents';
import { saveResults, WorkflowResult } from './save-results';

// PM이 요구사항을 분석하고 프론트/백엔드 작업 지시를 만드는 함수
export async function pmAnalyze(userRequirement: string): Promise<any> {
  console.log('👔 PM이 요구사항을 분석합니다...\n');

  const pmPrompt = `
사용자 요구사항:
"${userRequirement}"

위 요구사항을 분석해서 프론트엔드와 백엔드 팀에게 전달할 작업 지시를 만들어주세요.
반드시 순수 JSON 형식으로만 출력하세요:

{
  "requirement": "원본 요구사항 1줄 요약",
  "frontendTask": "프론트엔드 팀 작업 지시 (3-5줄)",
  "backendTask": "백엔드 팀 작업 지시 (3-5줄)",
  "constraints": ["공통 제약사항1", "제약사항2"],
  "priority": "high/medium/low"
}
`;

  const pmResponse = await callLLM(pmAgent.systemPrompt, pmPrompt);

  // JSON 파싱
  try {
    const cleanedJson = pmResponse
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.warn('⚠️  PM 응답 파싱 실패');
    throw new Error('PM이 올바른 형식으로 응답하지 않았습니다.');
  }
}

// 전체 워크플로우: 사용자 → PM → [프론트팀, 백엔드팀] 병렬 작업 → 결과 → 저장
export async function runFullWorkflow(
  userRequirement: string,
  saveToFile: boolean = true // ✨ 저장 옵션 추가
) {
  console.log('🚀 AI 팀 협업 시작!');
  console.log('═'.repeat(60));
  console.log(`\n📋 사용자 요구사항:\n"${userRequirement}"\n`);
  console.log('─'.repeat(60));

  // 1단계: PM이 요구사항 분석
  const pmTask = await pmAnalyze(userRequirement);

  console.log('✅ PM 분석 완료!\n');
  console.log('📌 요약:', pmTask.requirement);
  console.log('🎯 우선순위:', pmTask.priority);
  console.log('⚠️  공통 제약사항:');
  pmTask.constraints.forEach((c: string, i: number) => {
    console.log(`   ${i + 1}. ${c}`);
  });
  console.log('\n💼 프론트엔드 작업 지시:');
  console.log(pmTask.frontendTask);
  console.log('\n💼 백엔드 작업 지시:');
  console.log(pmTask.backendTask);
  console.log('\n' + '─'.repeat(60));

  // 2단계: 프론트엔드와 백엔드 팀이 병렬로 작업
  console.log('\n⚡ 프론트엔드와 백엔드 팀이 동시에 작업합니다...\n');

  const [frontendResult, backendResult] = await Promise.all([
    teamConsensus(frontendAgents, pmTask.frontendTask, arbiter),
    teamConsensus(backendAgents, pmTask.backendTask, backendArbiter),
  ]);

  // 3단계: 최종 결과 정리
  console.log('\n📊 최종 산출물');
  console.log('═'.repeat(60));

  console.log('\n🎨 프론트엔드 결과');
  console.log('─'.repeat(60));
  console.log('✨ 핵심 결정사항:');
  console.log(frontendResult.summary);
  console.log('\n📝 프론트엔드 코드:');
  console.log(frontendResult.codeSketch);
  console.log('\n⚠️  프론트엔드 리스크:');
  frontendResult.risks?.forEach((risk: string, i: number) => {
    console.log(`   ${i + 1}. ${risk}`);
  });

  console.log('\n' + '─'.repeat(60));
  console.log('\n⚙️  백엔드 결과');
  console.log('─'.repeat(60));
  console.log('✨ 핵심 결정사항:');
  console.log(backendResult.summary);
  console.log('\n📡 API 스펙:');
  console.log(backendResult.apiSpec || '(API 스펙 누락)');
  console.log('\n📝 백엔드 코드:');
  console.log(backendResult.codeSketch);
  console.log('\n⚠️  백엔드 리스크:');
  backendResult.risks?.forEach((risk: string, i: number) => {
    console.log(`   ${i + 1}. ${risk}`);
  });

  console.log('\n' + '═'.repeat(60));

  // ✨ 4단계: 결과 저장
  const workflowResult: WorkflowResult = {
    timestamp: new Date().toISOString(),
    userRequirement,
    pmTask,
    frontendResult,
    backendResult,
  };

  if (saveToFile) {
    console.log('\n💾 결과를 파일로 저장합니다...');
    const savedFiles = saveResults(workflowResult);
    console.log(`\n✅ 저장 완료!`);
    console.log(`   📄 JSON: ${savedFiles.json}`);
    console.log(`   📄 Markdown: ${savedFiles.markdown}`);
  }

  console.log('\n✅ 전체 워크플로우 완료!\n');

  return workflowResult;
}