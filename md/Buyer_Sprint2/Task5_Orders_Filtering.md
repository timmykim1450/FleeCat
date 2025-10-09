# Task 5: Orders 필터링 시스템

**담당:** Frontend Team
**예상 소요:** 1.5일 (Day 5-6)
**우선순위:** 🔴 Critical
**의존성:** Task 1 (인프라), Task 2 (공통 컴포넌트)

---

## 📋 작업 개요

주문 내역 페이징, 필터링, 정렬 기능을 구현합니다. DateRangePicker와 StatusChip 공통 컴포넌트를 함께 개발합니다.

### 목표
- ✅ Orders 페이징 (limit/offset)
- ✅ 날짜 범위 필터 (DateRangePicker)
- ✅ 상태 필터 (StatusChip)
- ✅ URL 쿼리 파라미터 동기화
- ✅ 빈 상태/에러 처리

---

## 🎯 상세 작업 항목

### 5.1 DateRangePicker 컴포넌트

**파일 구조:**
```
src/components/DateRangePicker/
├── DateRangePicker.jsx
├── DateRangePicker.css
└── index.js
```

**Props API:**
```typescript
interface DateRangePickerProps {
  startDate?: Date | null
  endDate?: Date | null
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void
  maxDate?: Date
  minDate?: Date
  presets?: Array<{ label: string; days: number }>
}
```

**구현 예시:**
```jsx
// src/components/DateRangePicker/DateRangePicker.jsx
import { useState } from 'react'
import { Calendar } from 'lucide-react'
import './DateRangePicker.css'

const DEFAULT_PRESETS = [
  { label: '오늘', days: 0 },
  { label: '최근 7일', days: 7 },
  { label: '최근 30일', days: 30 },
  { label: '최근 90일', days: 90 }
]

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  maxDate = new Date(),
  minDate,
  presets = DEFAULT_PRESETS
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePresetClick = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)

    onChange({ startDate: start, endDate: end })
    setIsOpen(false)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="date-range-picker">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="date-range-picker__trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Calendar size={16} aria-hidden="true" />
        <span>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : '기간 선택'}
        </span>
      </button>

      {isOpen && (
        <div className="date-range-picker__dropdown" role="dialog">
          <div className="date-range-picker__presets">
            {presets.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.days)}
                className="preset-btn"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="date-range-picker__custom">
            <label htmlFor="start-date" className="date-label">
              시작일
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                onChange({ startDate: e.target.value ? new Date(e.target.value) : null, endDate })
              }
              max={maxDate?.toISOString().split('T')[0]}
              min={minDate?.toISOString().split('T')[0]}
              className="date-input"
            />

            <label htmlFor="end-date" className="date-label">
              종료일
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                onChange({ startDate, endDate: e.target.value ? new Date(e.target.value) : null })
              }
              max={maxDate?.toISOString().split('T')[0]}
              min={startDate?.toISOString().split('T')[0] || minDate?.toISOString().split('T')[0]}
              className="date-input"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onChange({ startDate: null, endDate: null })
              setIsOpen(false)
            }}
            className="date-range-picker__clear"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  )
}
```

### 5.2 StatusChip 컴포넌트

**파일 구조:**
```
src/components/StatusChip/
├── StatusChip.jsx
├── StatusChip.css
└── index.js
```

**Props API:**
```typescript
interface StatusChipProps {
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'all'
  selected?: boolean
  onClick?: () => void
  count?: number
}
```

**구현 예시:**
```jsx
// src/components/StatusChip/StatusChip.jsx
import './StatusChip.css'

const STATUS_MAP = {
  all: { label: '전체', color: 'gray' },
  pending: { label: '결제대기', color: 'yellow' },
  preparing: { label: '상품준비중', color: 'blue' },
  shipped: { label: '배송중', color: 'purple' },
  delivered: { label: '배송완료', color: 'green' },
  cancelled: { label: '취소', color: 'red' },
  refunded: { label: '환불', color: 'orange' }
}

export default function StatusChip({ status, selected = false, onClick, count }) {
  const statusInfo = STATUS_MAP[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`status-chip status-chip--${statusInfo.color} ${
        selected ? 'status-chip--selected' : ''
      }`}
      aria-pressed={selected}
    >
      <span className="status-chip__label">{statusInfo.label}</span>
      {count !== undefined && (
        <span className="status-chip__count">{count}</span>
      )}
    </button>
  )
}
```

### 5.3 Orders 스키마

**파일:** `src/schemas/order.ts`

```typescript
import { z } from 'zod'

export const orderSchema = z.object({
  order_id: z.number().int().positive(),
  member_id: z.number().int().positive(),
  shopping_cart_id: z.number().int().positive().nullable(),
  coupon_id: z.number().int().positive().nullable(),
  order_number: z.string(),
  order_total_amount: z.number(),
  order_discount_amount: z.number(),
  order_subtotal_amount: z.number(),
  order_status: z.enum(['pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  order_recipient_name: z.string(),
  order_recipient_phone: z.string(),
  order_recipient_address: z.string(),
  order_message: z.string().nullable(),
  order_created_at: z.string().datetime(),
  order_updated_at: z.string().datetime()
})

export type Order = z.infer<typeof orderSchema>

// 주문 필터 파라미터
export const orderFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10)
})

export type OrderFilter = z.infer<orderFilterSchema>
```

### 5.4 MSW 핸들러

**파일:** `src/mocks/handlers/order.ts`

```typescript
import { http, HttpResponse, delay } from 'msw'
import ordersData from '../data/orders.json'

export const orderHandlers = [
  http.get('/api/orders', async ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'all'
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10

    await delay(500)

    let filtered = [...ordersData.orders]

    // 상태 필터
    if (status !== 'all') {
      filtered = filtered.filter(order => order.order_status === status)
    }

    // 날짜 필터
    if (startDate) {
      filtered = filtered.filter(
        order => new Date(order.order_created_at) >= new Date(startDate)
      )
    }
    if (endDate) {
      filtered = filtered.filter(
        order => new Date(order.order_created_at) <= new Date(endDate)
      )
    }

    // 페이징
    const total = filtered.length
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return HttpResponse.json({
      orders: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  })
]
```

### 5.5 Orders 페이지

**파일:** `src/pages/Orders/Orders.jsx`

```jsx
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import DateRangePicker from '@/components/DateRangePicker'
import StatusChip from '@/components/StatusChip'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import SkeletonList from '@/components/SkeletonList'
import { fetcher } from '@/lib/http'
import './Orders.css'

const STATUSES = ['all', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status') || 'all'
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const page = Number(searchParams.get('page')) || 1

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', { status, startDate, endDate, page }],
    queryFn: () =>
      fetcher('/api/orders', {
        params: { status, startDate, endDate, page: String(page), limit: '10' }
      })
  })

  const handleStatusChange = (newStatus) => {
    setSearchParams({ status: newStatus, page: '1' })
  }

  const handleDateRangeChange = ({ startDate, endDate }) => {
    const params = { status }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()
    params.page = '1'
    setSearchParams(params)
  }

  if (isLoading) {
    return <SkeletonList count={5} variant="card" height="150px" />
  }

  if (error) {
    return (
      <ErrorState
        title="주문 내역을 불러올 수 없습니다"
        error={error}
        onRetry={refetch}
      />
    )
  }

  if (!data?.orders.length) {
    return (
      <EmptyState
        title="주문 내역이 없습니다"
        message="필터를 변경하거나 새로운 주문을 시작해보세요"
      />
    )
  }

  return (
    <div className="orders-page">
      <h2 className="orders-page__title">주문 내역</h2>

      {/* 필터 */}
      <div className="orders-filters">
        <DateRangePicker
          startDate={startDate ? new Date(startDate) : null}
          endDate={endDate ? new Date(endDate) : null}
          onChange={handleDateRangeChange}
        />

        <div className="status-chips">
          {STATUSES.map(s => (
            <StatusChip
              key={s}
              status={s}
              selected={status === s}
              onClick={() => handleStatusChange(s)}
            />
          ))}
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="orders-list">
        {data.orders.map(order => (
          <div key={order.order_id} className="order-card">
            {/* 주문 카드 내용 */}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {data.pagination.totalPages > 1 && (
        <div className="pagination">
          {/* 페이지네이션 버튼 */}
        </div>
      )}
    </div>
  )
}
```

---

## 🔍 테스트 체크리스트

### 기능 테스트
- [ ] 페이징 동작 확인
- [ ] 상태 필터 동작 확인
- [ ] 날짜 필터 동작 확인
- [ ] URL 쿼리 파라미터 동기화
- [ ] 필터 조합 테스트

### 컴포넌트
- [ ] DateRangePicker 프리셋 동작
- [ ] StatusChip 선택 상태 표시
- [ ] 빈 결과 EmptyState 표시

---

## ✅ Definition of Done

- [ ] DateRangePicker, StatusChip 컴포넌트 완성
- [ ] Orders 페이징/필터 구현
- [ ] URL 쿼리 파라미터 동기화
- [ ] MSW 핸들러 동작
- [ ] 반응형 디자인
- [ ] 접근성 준수

---

## 📚 참고 자료

- [React Router useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [Date Input MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)

---

## 🚨 주의사항

1. **URL 동기화**: 필터 상태는 반드시 URL에 반영
2. **날짜 형식**: ISO 8601 형식 사용
3. **페이지 리셋**: 필터 변경 시 page=1로 초기화
4. **접근성**: aria-pressed, role 속성 필수
5. **성능**: 불필요한 리렌더링 방지
