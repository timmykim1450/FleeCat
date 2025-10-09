# Task 2: 공통 상태 컴포넌트 구축

**담당:** Frontend Team
**예상 소요:** 1일 (Day 2-3)
**우선순위:** 🔴 Critical (모든 페이지에서 재사용)
**의존성:** Task 1 (인프라 구축 완료 필요)

---

## 📋 작업 개요

일관된 사용자 경험을 위한 공통 상태 표시 컴포넌트를 구축합니다. 에러, 빈 상태, 로딩 상태를 표준화하여 모든 페이지에서 재사용합니다.

### 목표
- ✅ ErrorState 컴포넌트 구현
- ✅ EmptyState 컴포넌트 구현
- ✅ SkeletonList 컴포넌트 구현
- ✅ 일관된 디자인 시스템 적용
- ✅ 접근성 기본 준수

---

## 🎯 상세 작업 항목

### 2.1 ErrorState 컴포넌트

**파일 구조:**
```
src/components/ErrorState/
├── ErrorState.jsx
├── ErrorState.css
└── index.js
```

**Props API:**
```typescript
interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | ApiError
  onRetry?: () => void
  variant?: 'network' | 'server' | 'notfound' | 'generic'
}
```

**구현 예시:**
```jsx
// src/components/ErrorState/ErrorState.jsx
import { AlertCircle, WifiOff, ServerCrash } from 'lucide-react'
import './ErrorState.css'

const iconMap = {
  network: WifiOff,
  server: ServerCrash,
  notfound: AlertCircle,
  generic: AlertCircle
}

export default function ErrorState({
  title = '문제가 발생했습니다',
  message,
  error,
  onRetry,
  variant = 'generic'
}) {
  const Icon = iconMap[variant]
  const errorMessage = message || error?.message || '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-state__icon">
        <Icon size={48} aria-hidden="true" />
      </div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__message">{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="error-state__retry-btn"
          type="button"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
```

### 2.2 EmptyState 컴포넌트

**파일 구조:**
```
src/components/EmptyState/
├── EmptyState.jsx
├── EmptyState.css
└── index.js
```

**Props API:**
```typescript
interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}
```

**구현 예시:**
```jsx
// src/components/EmptyState/EmptyState.jsx
import { Inbox } from 'lucide-react'
import './EmptyState.css'

export default function EmptyState({
  title = '데이터가 없습니다',
  message = '아직 표시할 내용이 없습니다.',
  icon,
  action
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon || <Inbox size={48} />}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="empty-state__action-btn"
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
```

### 2.3 SkeletonList 컴포넌트

**파일 구조:**
```
src/components/SkeletonList/
├── SkeletonList.jsx
├── SkeletonList.css
└── index.js
```

**Props API:**
```typescript
interface SkeletonListProps {
  count?: number
  variant?: 'card' | 'list' | 'table'
  height?: string | number
}
```

**구현 예시:**
```jsx
// src/components/SkeletonList/SkeletonList.jsx
import './SkeletonList.css'

export default function SkeletonList({
  count = 3,
  variant = 'card',
  height = '120px'
}) {
  return (
    <div className={`skeleton-list skeleton-list--${variant}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton-item"
          style={{ height }}
          aria-busy="true"
          aria-label="로딩 중"
        >
          <div className="skeleton-shimmer" />
        </div>
      ))}
    </div>
  )
}
```

### 2.4 스타일 가이드

**CSS 변수 활용:**
```css
/* src/styles/index.css에 추가 */
:root {
  /* 상태 색상 */
  --color-error: #dc2626;
  --color-success: #16a34a;
  --color-warning: #ea580c;
  --color-info: #0284c7;

  /* 텍스트 색상 */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;

  /* 스켈레톤 색상 */
  --color-skeleton-base: #e5e7eb;
  --color-skeleton-shimmer: rgba(255, 255, 255, 0.5);
}
```

### 2.5 사용 예시

**Orders 페이지:**
```jsx
import { useQuery } from '@tanstack/react-query'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import SkeletonList from '@/components/SkeletonList'
import { ShoppingBag } from 'lucide-react'

function OrdersPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  })

  if (isLoading) {
    return <SkeletonList count={5} variant="card" height="150px" />
  }

  if (error) {
    return (
      <ErrorState
        title="주문 내역을 불러올 수 없습니다"
        error={error}
        variant="network"
        onRetry={refetch}
      />
    )
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="주문 내역이 없습니다"
        message="첫 주문을 시작해보세요!"
        icon={<ShoppingBag size={48} />}
        action={{
          label: '쇼핑하러 가기',
          onClick: () => navigate('/products')
        }}
      />
    )
  }

  return <OrdersList orders={data} />
}
```

---

## 🔍 테스트 체크리스트

### 시각적 확인
- [ ] ErrorState가 다양한 에러 시나리오에서 올바르게 표시됨
- [ ] EmptyState가 깨끗하고 명확하게 표시됨
- [ ] SkeletonList 애니메이션이 자연스러움
- [ ] 모든 컴포넌트가 반응형으로 동작
- [ ] 다양한 높이/너비에서 레이아웃 깨지지 않음

### 접근성
- [ ] ErrorState에 `role="alert"` 및 `aria-live="assertive"` 적용
- [ ] SkeletonList에 `aria-busy="true"` 적용
- [ ] 키보드로 버튼 접근 가능
- [ ] 포커스 스타일이 명확함 (outline)
- [ ] 아이콘에 `aria-hidden="true"` 적용

### 다크모드
- [ ] 모든 컴포넌트가 다크모드에서 정상 작동
- [ ] 색상 대비가 충분함 (WCAG AA 준수)

### 브라우저 호환성
- [ ] Chrome, Firefox, Safari, Edge에서 동작 확인

---

## ✅ Definition of Done

- [ ] ErrorState, EmptyState, SkeletonList 컴포넌트 구현 완료
- [ ] 일관된 디자인 시스템 적용 (CSS 변수 사용)
- [ ] 접근성 기본 준수 (role, aria-* 속성)
- [ ] 모든 페이지에서 재사용 가능한 구조
- [ ] 반응형 디자인 적용
- [ ] 컴포넌트 문서화 (JSDoc 주석)
- [ ] 최소 2개 페이지에서 실제 사용 확인
- [ ] prefers-reduced-motion 미디어 쿼리 적용

---

## 📦 설치 패키지

```bash
# 이미 설치되어 있음 (Task 1에서 설치)
npm install lucide-react
```

---

## 📚 참고 자료

- [WAI-ARIA: Alert Role](https://www.w3.org/TR/wai-aria-1.2/#alert)
- [Skeleton Screen Best Practices](https://www.nngroup.com/articles/skeleton-screens/)
- [Empty State Design Patterns](https://emptystat.es/)
- [Lucide Icons](https://lucide.dev/)

---

## 🚨 주의사항

1. **접근성 최우선**: role, aria-label 필수 적용
2. **애니메이션 배려**: `prefers-reduced-motion` 미디어 쿼리 적용
3. **CSS 변수 사용**: 하드코딩된 색상 금지
4. **일관성 유지**: 모든 페이지에서 동일한 컴포넌트 사용
5. **성능**: SkeletonList는 가상화 없이 구현 (개수 제한)
6. **에러 메시지**: 사용자 친화적이고 명확한 메시지 작성
