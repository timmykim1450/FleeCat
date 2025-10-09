import * as fs from 'fs';
import * as path from 'path';

// 결과 저장을 위한 인터페이스
export interface WorkflowResult {
  timestamp: string;
  userRequirement: string;
  pmTask: any;
  frontendResult: any;
  backendResult: any;
}

// output 폴더 생성
function ensureOutputDir() {
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

// 파일명 생성 (타임스탬프 + 요구사항 일부)
function generateFileName(requirement: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const sanitized = requirement
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return `${timestamp}_${sanitized}`;
}

// JSON 파일로 저장
export function saveAsJSON(result: WorkflowResult): string {
  const outputDir = ensureOutputDir();
  const fileName = generateFileName(result.userRequirement);
  const filePath = path.join(outputDir, `${fileName}.json`);

  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');
  
  return filePath;
}

// 마크다운 파일로 저장 (읽기 쉬운 형식)
export function saveAsMarkdown(result: WorkflowResult): string {
  const outputDir = ensureOutputDir();
  const fileName = generateFileName(result.userRequirement);
  const filePath = path.join(outputDir, `${fileName}.md`);

  const markdown = `# AI 팀 협업 결과

## 📋 요구사항
${result.userRequirement}

## 🕐 작성 시간
${new Date(result.timestamp).toLocaleString('ko-KR')}

---

## 👔 PM 분석

### 요약
${result.pmTask.requirement}

### 우선순위
${result.pmTask.priority}

### 제약사항
${result.pmTask.constraints.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

### 프론트엔드 작업 지시
${result.pmTask.frontendTask}

### 백엔드 작업 지시
${result.pmTask.backendTask}

---

## 🎨 프론트엔드 결과

### 핵심 결정사항
${result.frontendResult.summary}

### 코드
\`\`\`javascript
${result.frontendResult.codeSketch}
\`\`\`

### 리스크
${result.frontendResult.risks?.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n') || '없음'}

---

## ⚙️ 백엔드 결과

### 핵심 결정사항
${result.backendResult.summary}

### API 스펙
\`\`\`
${result.backendResult.apiSpec || 'API 스펙 없음'}
\`\`\`

### 코드
\`\`\`javascript
${result.backendResult.codeSketch}
\`\`\`

### 리스크
${result.backendResult.risks?.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n') || '없음'}

---

*이 문서는 AI 팀 협업 시스템에 의해 자동 생성되었습니다.*
`;

  fs.writeFileSync(filePath, markdown, 'utf-8');
  
  return filePath;
}

// 두 형식 모두 저장
export function saveResults(result: WorkflowResult): { json: string; markdown: string } {
  const jsonPath = saveAsJSON(result);
  const markdownPath = saveAsMarkdown(result);
  
  return {
    json: jsonPath,
    markdown: markdownPath,
  };
}