# Task 1: 프로젝트 셋업 및 인프라 구축 - 구현 결과

**작업일:** 2025-10-08
**상태:** ✅ 완료
**소요 시간:** 약 1시간

---

## 📋 구현 완료 항목

### 1. 패키지 설치 ✅
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zod react-hook-form @hookform/resolvers
npm install msw --save-dev
```

### 2. MSW 초기화 ✅
```bash
npx msw init public/ --save
```
- `public/mockServiceWorker.js` 생성됨
- `package.json`에 `msw.workerDirectory` 자동 추가됨

### 3. 디렉토리 구조 생성 ✅
```
src/
├── mocks/
│   ├── handlers/
│   │   ├── index.ts
│   │   ├── member.ts
│   │   ├── address.ts
│   │   └── order.ts
│   ├── data/
│   │   ├── members.json
│   │   ├── addresses.json
│   │   └── orders.json
│   └── browser.ts
├── schemas/
│   ├── member.ts
│   ├── address.ts
│   ├── order.ts
│   └── payment.ts
├── lib/
│   ├── http.ts
│   ├── errors.ts
│   └── queryClient.ts
└── providers/
    └── QueryProvider.tsx
```

---

## 🎯 주요 구현 내용

### Zod 스키마 (schemas/)
- **member.ts**: 회원 정보, 프로필 업데이트, 비밀번호 변경 스키마
- **address.ts**: 주소 정보, 주소 생성/수정 스키마
- **order.ts**: 주문 정보, 주문 아이템, 필터링 스키마
- **payment.ts**: 결제 정보 스키마

### HTTP 클라이언트 (lib/)
- **http.ts**: fetch 래퍼, GET/POST/PUT/PATCH/DELETE 메서드
- **errors.ts**: ApiError, NetworkError, ValidationError 클래스
- **queryClient.ts**: React Query 설정 (staleTime: 5분, gcTime: 30분)

### MSW 핸들러 (mocks/handlers/)
- **member.ts**:
  - GET `/api/member/profile` - 프로필 조회
  - PUT `/api/member/profile` - 프로필 수정
  - DELETE `/api/member/account` - 계정 삭제

- **address.ts**:
  - GET `/api/addresses` - 주소 목록 조회 (member_id 필터)
  - GET `/api/addresses/:id` - 주소 상세 조회
  - POST `/api/addresses` - 주소 생성
  - PUT `/api/addresses/:id` - 주소 수정
  - DELETE `/api/addresses/:id` - 주소 삭제

- **order.ts**:
  - GET `/api/orders` - 주문 목록 조회 (필터링, 페이지네이션)
  - GET `/api/orders/:id` - 주문 상세 조회
  - POST `/api/orders/:id/cancel` - 주문 취소

### Mock 데이터 (mocks/data/)
- **members.json**: 2명의 회원 데이터
- **addresses.json**: 4개의 주소 데이터 (member_id: 1, 2)
- **orders.json**: 4개의 주문 데이터 (아이템 포함)

### 기타
- **browser.ts**: MSW 워커 설정
- **QueryProvider.tsx**: React Query Provider + DevTools
- **main.jsx**: MSW 및 QueryProvider 통합

---

## 🔍 테스트 페이지

### `/test-infra` 라우트 추가 ✅
- **위치**: `src/pages/TestInfra/`
- **기능**:
  - Test 1: 회원 프로필 조회 및 수정
  - Test 2: 주소 목록 조회
  - Test 3: 주문 목록 조회
  - React Query DevTools 확인
  - MSW 인터셉트 확인

### 테스트 방법
1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:5173/test-infra` 접속
3. 확인 사항:
   - ✅ 콘솔에 `[MSW]` 로그 출력
   - ✅ React Query DevTools 좌측 하단 표시
   - ✅ 데이터 로딩 시 300-1200ms 지연
   - ✅ 새로고침 시 10% 확률로 에러 발생
   - ✅ "Update Profile" 버튼 클릭 시 캐시 자동 갱신

---

## 📦 주요 기능

### 1. 네트워크 시뮬레이션
- 랜덤 지연: 300-1200ms
- 랜덤 에러: 10% 확률로 500 에러

### 2. 데이터 검증
- Zod 스키마로 요청/응답 검증
- 타입 안전성 확보

### 3. 상태 관리
- React Query로 서버 상태 관리
- 자동 캐싱 및 재검증
- DevTools로 상태 모니터링

### 4. 에러 처리
- 통합 에러 클래스 (ApiError, NetworkError, ValidationError)
- 일관된 에러 응답 구조

---

## ✅ Definition of Done 체크리스트

- [x] MSW가 모든 필요한 API 엔드포인트를 커버
- [x] React Query Provider가 앱에 통합됨
- [x] 모든 테이블에 대한 Zod 스키마 정의 완료
- [x] HTTP 클라이언트가 에러를 일관되게 처리
- [x] Mock 데이터 시드가 현실적인 데이터 포함
- [x] 에러/지연 시뮬레이터가 작동
- [x] React Query DevTools 동작 확인
- [x] 테스트 페이지 작성 및 검증

---

## 🚀 개발 서버 상태

```
VITE v7.1.7  ready in 487 ms

➜  Local:   http://localhost:5173/
```

- HMR(Hot Module Replacement) 정상 작동
- 에러 없이 정상 실행 중

---

## 📝 다음 단계

Task 1 인프라 구축이 완료되어 다음 작업들을 진행할 수 있습니다:

- **Task 2**: 공통 컴포넌트 개발
- **Task 3**: 프로필 페이지 구현
- **Task 4**: 주소 관리 기능 구현
- **Task 5-12**: 기타 기능 구현

모든 후속 작업은 이 인프라를 기반으로 진행됩니다.
