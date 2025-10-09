# Task 10: 성능 최적화

**담당:** Frontend Team
**예상 소요:** 1일 (Day 9)
**우선순위:** 🔴 Critical
**의존성:** Task 3-6 (주요 페이지)

---

## 📋 작업 개요

프론트엔드 성능 최적화로 사용자 경험을 개선합니다.

### 목표
- ✅ TTI < 3.0s 달성
- ✅ 번들 크기 < 250KB (gzip)
- ✅ 라우트 코드 스플리팅
- ✅ 이미지 최적화
- ✅ 리스트 가상화

---

## 🎯 상세 작업 항목

### 10.1 라우트 코드 스플리팅

**적용 대상:**
- `/account/profile` - Profile 페이지
- `/account/address` - Address 페이지
- `/account/orders` - Orders 페이지
- `/account/settings` - Settings 페이지

**구현:**
```jsx
const Profile = lazy(() => import('./pages/Profile'))
const Address = lazy(() => import('./pages/Address'))
const Orders = lazy(() => import('./pages/Orders'))
const Settings = lazy(() => import('./pages/Settings'))
```

**Suspense 경계:**
- 각 라우트에 적절한 로딩 표시
- SkeletonList 활용

### 10.2 이미지 최적화

**전략:**
- `loading="lazy"` 속성 추가
- 적절한 이미지 크기 사용 (썸네일 vs 원본)
- WebP 포맷 우선 사용
- 이미지 CDN 활용 (추후)

**적용 대상:**
- 주문 상품 이미지
- 프로필 사진 (있을 경우)

### 10.3 리스트 가상화

**적용 조건:** Orders 목록이 50개 이상일 때

**라이브러리:** `react-window` 또는 `@tanstack/react-virtual`

**구현:**
- 고정 높이 아이템으로 가상 스크롤
- 스크롤 위치 유지
- 페이지네이션과 병행 사용

### 10.4 번들 최적화

**Tree Shaking:**
- Lucide-react 아이콘 개별 import
- lodash 대신 lodash-es 사용 (또는 개별 함수 import)

**Code Splitting:**
- React Query DevTools는 개발 환경에서만 로드
- MSW는 개발 환경에서만 로드 (이미 구현)

**Chunk 분석:**
```bash
npm run build
npx vite-bundle-visualizer
```

### 10.5 캐싱 전략

**React Query 설정:**
- staleTime: 5분 (프로필, 주소)
- gcTime: 30분
- 불필요한 refetch 방지

**이미지 캐싱:**
- Cache-Control 헤더 활용 (백엔드 작업)

---

## 🔍 성능 지표

### Core Web Vitals 목표
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 번들 크기 목표
- 초기 JS 번들: < 250KB (gzip)
- CSS: < 50KB (gzip)
- 라우트별 청크: < 100KB (gzip)

---

## 🔍 테스트 체크리스트

- [ ] Lighthouse 성능 점수 90+ 달성
- [ ] TTI < 3.0s (3G 환경)
- [ ] 번들 크기 목표 달성
- [ ] 라우트 전환 시 스켈레톤 표시
- [ ] 이미지 lazy loading 동작
- [ ] 가상화 리스트 스크롤 부드러움

---

## ✅ Definition of Done

- [ ] 라우트 코드 스플리팅 완료
- [ ] 이미지 최적화 적용
- [ ] 리스트 가상화 구현 (50+ 아이템)
- [ ] 번들 크기 < 250KB 달성
- [ ] Lighthouse 성능 점수 90+
- [ ] Core Web Vitals 목표 달성

---

## 📦 설치 패키지

```bash
npm install @tanstack/react-virtual
npm install -D vite-bundle-visualizer
```

---

## 📚 참고 자료

- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Web.dev Performance](https://web.dev/performance/)
- [React Virtual](https://tanstack.com/virtual/latest)

---

## 🚨 주의사항

1. **과도한 최적화 방지**: 측정 → 개선 → 검증 순서
2. **가상화 조건**: 50개 미만은 일반 렌더링 사용
3. **이미지 포맷**: WebP 지원 여부 확인
4. **캐싱**: 적절한 staleTime 설정으로 UX/성능 균형
5. **Lighthouse**: 시크릿 모드에서 측정
