# Task 1: 프로젝트 셋업 및 인프라 구축

**담당:** Frontend Team
**예상 소요:** 2일 (Day 1-2)
**우선순위:** 🔴 Critical (모든 작업의 기반)
**의존성:** 없음 (독립 작업)

---

## 📋 작업 개요

Sprint 2의 기반이 되는 Mock API 인프라, 상태관리, 타입 시스템을 구축합니다. 이 작업은 모든 후속 작업의 전제조건입니다.

### 목표
- ✅ MSW(Mock Service Worker) 기반 API 모킹 환경 구축
- ✅ React Query 상태관리 표준화
- ✅ Zod 기반 타입 안전성 확보
- ✅ 공통 HTTP 클라이언트 및 에러 처리 인프라
- ✅ Mock 데이터 시드 및 시뮬레이터

---

## 🎯 상세 작업 항목

### 1.1 Mock Service Worker (MSW) 설정

**파일:**
- `src/mocks/browser.ts` - MSW 브라우저 설정
- `src/mocks/handlers/index.ts` - 핸들러 통합
- `src/mocks/handlers/member.ts` - 회원 API 핸들러
- `src/mocks/handlers/address.ts` - 주소 API 핸들러
- `src/mocks/handlers/order.ts` - 주문 API 핸들러
- `src/mocks/data/seed.json` - 초기 Mock 데이터

**작업 내용:**
```bash
# MSW 설치
npm install msw --save-dev
npx msw init public/ --save

# 구조 생성
mkdir -p src/mocks/handlers
mkdir -p src/mocks/data
```

**핸들러 주요 기능:**
- `http.get/post/put/delete` - REST API 엔드포인트 정의
- `delay()` - 네트워크 지연 시뮬레이션 (300-1200ms)
- 랜덤 에러 주입 (10% 확률)
- Zod 스키마로 요청/응답 검증

### 1.2 React Query 설정

**파일:**
- `src/lib/queryClient.ts` - Query Client 설정
- `src/providers/QueryProvider.tsx` - Provider 래퍼

**설정 내용:**
- staleTime: 5분, gcTime: 30분
- retry: 1회
- refetchOnWindowFocus: false
- QueryClientProvider로 앱 래핑

### 1.3 Zod 스키마 정의

**파일:**
- `src/schemas/member.ts`
- `src/schemas/address.ts`
- `src/schemas/order.ts`
- `src/schemas/payment.ts`

**스키마 구조:**
- 백엔드 Prisma 스키마와 1:1 매칭
- 유효성 검증 규칙 (min, max, regex, enum)
- 타입 자동 추론 (`z.infer<typeof schema>`)
- 부분 스키마 (pick, omit) 활용

### 1.4 HTTP 클라이언트 및 에러 처리

**파일:**
- `src/lib/http.ts` - 공통 fetch 래퍼
- `src/lib/errors.ts` - 에러 타입 정의

```typescript
// src/lib/http.ts
type RequestConfig = RequestInit & {
  params?: Record<string, string>
  delay?: number // 개발용 지연 시뮬레이션
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetcher<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, delay: customDelay, ...init } = config

  // Query params 처리
  const urlWithParams = params
    ? `${url}?${new URLSearchParams(params)}`
    : url

  // 개발용 지연
  if (customDelay && import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, customDelay))
  }

  const response = await fetch(urlWithParams, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorData.message || response.statusText,
      errorData
    )
  }

  return response.json()
}
```

### 1.5 Mock 데이터 시드

**파일:**
- `src/mocks/data/members.json`
- `src/mocks/data/addresses.json`
- `src/mocks/data/orders.json`

**예시:**
```json
// src/mocks/data/members.json
{
  "members": [
    {
      "member_id": 1,
      "company_id": null,
      "member_email": "buyer@fleecat.com",
      "member_password": null,
      "member_name": "홍길동",
      "member_nickname": "구매왕",
      "member_phone": "010-1234-5678",
      "member_account_type": "individual",
      "member_account_role": "buyer",
      "member_status": "active",
      "member_marketing_email": true,
      "member_marketing_sms": false,
      "member_last_login_at": "2025-10-08T10:00:00Z",
      "member_created_at": "2025-09-01T00:00:00Z",
      "member_updated_at": "2025-10-08T10:00:00Z"
    }
  ]
}
```

### 1.6 Main.tsx MSW 통합

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'warn'
    })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
```

---

## 🔍 테스트 체크리스트

### MSW 동작 확인
- [ ] MSW가 개발 서버에서 정상 작동
- [ ] Network 탭에서 `[MSW]` 로그 확인
- [ ] 핸들러가 요청을 올바르게 가로채는지 확인

### React Query 동작 확인
- [ ] Query DevTools가 표시됨
- [ ] 캐싱 동작 확인 (동일 요청 중복 방지)
- [ ] 에러 상태가 올바르게 처리됨

### Zod 유효성 검증
- [ ] 잘못된 데이터 입력 시 에러 발생
- [ ] 타입 추론이 올바르게 작동
- [ ] 에러 메시지가 명확함

### 에러 시뮬레이션
- [ ] 랜덤 에러 발생 확인 (10% 확률)
- [ ] 500 에러 처리
- [ ] 404 에러 처리
- [ ] 네트워크 지연 동작 (300-1200ms)

---

## ✅ Definition of Done

- [ ] MSW가 모든 필요한 API 엔드포인트를 커버
- [ ] React Query Provider가 앱에 통합됨
- [ ] 모든 테이블에 대한 Zod 스키마 정의 완료
- [ ] HTTP 클라이언트가 에러를 일관되게 처리
- [ ] Mock 데이터 시드가 현실적인 데이터 포함
- [ ] 에러/지연 시뮬레이터가 작동
- [ ] React Query DevTools 동작 확인
- [ ] 문서화 (README.md 업데이트)

---

## 📦 설치 패키지

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zod react-hook-form @hookform/resolvers
npm install msw --save-dev
```

---

## 📚 참고 자료

- [MSW Documentation](https://mswjs.io/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)

---

## 🚨 주의사항

1. **MSW는 개발 환경에서만 사용** (`import.meta.env.DEV` 체크)
2. **실제 백엔드 API 경로와 일치**시킬 것 (`/api/...`)
3. **Zod 스키마는 백엔드 Prisma 스키마와 정확히 일치**
4. **민감 정보(비밀번호 등)는 Mock 데이터에서도 제외**
5. **에러 시뮬레이션 확률은 개발 시에만 활성화**
