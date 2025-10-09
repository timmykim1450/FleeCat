# Task 11: 테스트 자동화

**담당:** Frontend Team
**예상 소요:** 1.5일 (Day 9-10)
**우선순위:** 🔴 Critical
**의존성:** Task 1-10 (전체 구현 완료)

---

## 📋 작업 개요

유닛, 통합, E2E 테스트를 구현하여 코드 품질을 보장합니다.

### 목표
- ✅ 유닛 테스트 (Jest + RTL)
- ✅ 통합 테스트 (주요 플로우)
- ✅ E2E 테스트 (Playwright + MSW)
- ✅ 커버리지 목표 달성

---

## 🎯 상세 작업 항목

### 11.1 테스트 환경 설정

**설치:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
```

**설정 파일:**
- `vitest.config.ts` - Vitest 설정
- `playwright.config.ts` - Playwright 설정
- `src/test/setup.ts` - 테스트 글로벌 설정

### 11.2 유닛 테스트

**대상 컴포넌트:**
- ErrorState, EmptyState, SkeletonList
- DateRangePicker, StatusChip
- ThemeToggle
- Button, Input (기본 컴포넌트)

**대상 유틸:**
- `mapPostcodeResult()` - 우편번호 매핑
- `generateCSV()`, `downloadCSV()` - CSV 생성
- 날짜 포맷팅 함수
- 전화번호 포맷팅 함수

**커버리지 목표:** 80% 이상

### 11.3 통합 테스트

**시나리오 1: Orders 필터링**
```
1. Orders 페이지 렌더링
2. 상태 필터 선택 (배송중)
3. API 호출 확인 (MSW)
4. 필터링된 결과 표시
5. URL 쿼리 파라미터 업데이트 확인
```

**시나리오 2: Address 기본설정**
```
1. Address 목록 렌더링
2. 새 주소 추가
3. 기본 배송지로 설정
4. 기존 기본 배송지 자동 해제 확인
5. Toast 알림 표시 확인
```

**시나리오 3: Profile 수정**
```
1. Profile 페이지 렌더링
2. 폼 데이터 로드
3. 이름 변경
4. Optimistic UI 업데이트
5. 에러 시 롤백 테스트
```

**커버리지 목표:** 70% 이상

### 11.4 E2E 테스트

**시나리오: 전체 사용자 플로우**
```
1. Mock 로그인 → /account
2. Profile 수정/저장 → 토스트 확인
3. Address 추가 → 기본설정
4. Orders 필터 (최근 30일) → 2페이지 이동
5. 주문 상세 모달 열기 → CSV 저장
6. Settings → 비밀번호 변경 안내 모달
7. 다크모드 토글 → 테마 전환 확인
```

**Playwright 설정:**
- MSW와 통합
- 스크린샷 캡처
- 비디오 녹화 (실패 시)
- 병렬 실행

### 11.5 테스트 스크립트

**package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 🔍 테스트 체크리스트

### 유닛 테스트
- [ ] 공통 컴포넌트 테스트 통과
- [ ] 유틸 함수 테스트 통과
- [ ] 커버리지 80% 달성

### 통합 테스트
- [ ] Orders 필터링 시나리오 통과
- [ ] Address CRUD 시나리오 통과
- [ ] Profile 수정 시나리오 통과
- [ ] 커버리지 70% 달성

### E2E 테스트
- [ ] 전체 사용자 플로우 통과
- [ ] Chrome, Firefox, Safari 테스트
- [ ] 모바일 뷰포트 테스트

---

## ✅ Definition of Done

- [ ] 유닛 테스트 작성 완료 (80% 커버리지)
- [ ] 통합 테스트 작성 완료 (70% 커버리지)
- [ ] E2E 테스트 작성 완료 (주요 플로우)
- [ ] CI/CD 통합 준비
- [ ] 테스트 문서화
- [ ] 모든 테스트 통과

---

## 📚 참고 자료

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW + Testing](https://mswjs.io/docs/recipes/setup)

---

## 🚨 주의사항

1. **MSW 통합**: 테스트에서도 MSW 핸들러 사용
2. **Async 처리**: waitFor, findBy 사용
3. **테스트 격리**: 각 테스트는 독립적으로 실행
4. **Mock 클린업**: afterEach에서 정리
5. **E2E 안정성**: 적절한 대기 시간 설정
