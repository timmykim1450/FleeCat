import express from 'express';
import bodyParser from 'body-parser';
import { runFullWorkflow } from './pm-workflow';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 AI 팀 협업 시스템</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 1.1em;
        }
        
        .input-group {
            margin-bottom: 30px;
        }
        
        label {
            display: block;
            margin-bottom: 10px;
            color: #555;
            font-weight: 600;
            font-size: 1.1em;
        }
        
        textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.3s;
        }
        
        textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .examples {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .examples h3 {
            color: #555;
            margin-bottom: 10px;
            font-size: 0.9em;
        }
        
        .example-item {
            padding: 8px 12px;
            background: white;
            border-radius: 5px;
            margin: 5px 0;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 0.9em;
        }
        
        .example-item:hover {
            background: #667eea;
            color: white;
        }
        
        button {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        #result {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .result-section {
            margin: 20px 0;
            padding: 15px;
            background: white;
            border-radius: 8px;
        }
        
        .result-section h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI 팀 협업 시스템</h1>
        <p class="subtitle">프론트엔드 + 백엔드 팀이 동시에 개발합니다</p>
        
        <div class="examples">
            <h3>💡 예시를 클릭해보세요:</h3>
            <div class="example-item" onclick="setExample('로그인 페이지를 만들어줘. JWT 토큰 방식으로.')">
                로그인 페이지 만들기 (JWT)
            </div>
            <div class="example-item" onclick="setExample('상품 검색 기능을 만들어줘. 자동완성과 필터링 기능 포함.')">
                상품 검색 기능 (자동완성)
            </div>
            <div class="example-item" onclick="setExample('회원가입 API를 만들어줘. 이메일 인증도 포함해서.')">
                회원가입 API (이메일 인증)
            </div>
            <div class="example-item" onclick="setExample('대시보드를 만들어줘. 차트와 통계 데이터 표시.')">
                대시보드 (차트/통계)
            </div>
        </div>
        
        <div class="input-group">
            <label for="requirement">무엇을 만들까요?</label>
            <textarea 
                id="requirement" 
                rows="4" 
                placeholder="예: 로그인 페이지를 만들어줘. 이메일과 비밀번호 입력 필드가 필요해."
            ></textarea>
        </div>
        
        <button onclick="submit()">🚀 AI 팀에게 요청하기</button>
        
        <div id="result"></div>
    </div>
    
    <script>
        function setExample(text) {
            document.getElementById('requirement').value = text;
        }
        
        async function submit() {
            const requirement = document.getElementById('requirement').value.trim();
            const resultDiv = document.getElementById('result');
            const button = document.querySelector('button');
            
            if (!requirement) {
                alert('요구사항을 입력해주세요!');
                return;
            }
            
            // 로딩 표시
            button.disabled = true;
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = \`
                <div class="loading">
                    <div class="spinner"></div>
                    <h3>🤖 AI 팀이 작업 중입니다...</h3>
                    <p>프론트엔드와 백엔드 팀이 동시에 개발하고 있어요.</p>
                </div>
            \`;
            
            try {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ requirement })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    displayResult(data);
                } else {
                    throw new Error(data.error || '오류가 발생했습니다.');
                }
            } catch (error) {
                resultDiv.innerHTML = \`
                    <div class="result-section">
                        <h3>❌ 오류 발생</h3>
                        <p>\${error.message}</p>
                    </div>
                \`;
            } finally {
                button.disabled = false;
            }
        }
        
        function displayResult(data) {
            const resultDiv = document.getElementById('result');
            
            resultDiv.innerHTML = \`
                <div class="result-section">
                    <h3>👔 PM 분석</h3>
                    <p><strong>요약:</strong> \${data.pmTask.requirement}</p>
                    <p><strong>우선순위:</strong> \${data.pmTask.priority}</p>
                </div>
                
                <div class="result-section">
                    <h3>🎨 프론트엔드 결과</h3>
                    <p>\${data.frontendResult.summary}</p>
                    <details>
                        <summary style="cursor: pointer; color: #667eea; margin: 10px 0;">📝 코드 보기</summary>
                        <pre>\${escapeHtml(data.frontendResult.codeSketch)}</pre>
                    </details>
                </div>
                
                <div class="result-section">
                    <h3>⚙️ 백엔드 결과</h3>
                    <p>\${data.backendResult.summary}</p>
                    \${data.backendResult.apiSpec ? \`
                        <details>
                            <summary style="cursor: pointer; color: #667eea; margin: 10px 0;">📡 API 스펙</summary>
                            <pre>\${escapeHtml(data.backendResult.apiSpec)}</pre>
                        </details>
                    \` : ''}
                    <details>
                        <summary style="cursor: pointer; color: #667eea; margin: 10px 0;">📝 코드 보기</summary>
                        <pre>\${escapeHtml(data.backendResult.codeSketch)}</pre>
                    </details>
                </div>
                
                <div class="result-section">
                    <h3>✅ 완료!</h3>
                    <p>상세 결과는 <code>output/</code> 폴더에 저장되었습니다.</p>
                </div>
            \`;
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Enter 키로 제출 (Shift+Enter는 줄바꿈)
        document.getElementById('requirement').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
            }
        });
    </script>
</body>
</html>
  `);
});

// API 엔드포인트
app.post('/api/create', async (req, res) => {
  try {
    const { requirement } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: '요구사항이 필요합니다.' });
    }

    console.log(`\n📨 새 요청: ${requirement}\n`);

    const result = await runFullWorkflow(requirement, true);

    res.json(result);
  } catch (error: any) {
    console.error('❌ 오류:', error);
    res.status(500).json({ error: error.message || '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🌐 AI 팀 웹 서버 시작!                ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  console.log(`🌐 브라우저에서 접속하세요:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log('대기 중...\n');
});