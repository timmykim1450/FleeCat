# Task 6: Orders 상세 및 내보내기

**담당:** Frontend Team
**예상 소요:** 1.5일 (Day 6-7)
**우선순위:** 🟠 High
**의존성:** Task 5 (Orders 필터링)

---

## 📋 작업 개요

주문 상세 모달, CSV 내보내기, 프린트 인보이스 기능을 구현합니다.

### 목표
- ✅ 주문 상세 모달 (상품/배송지/결제/타임라인)
- ✅ CSV 내보내기 기능
- ✅ 프린트용 인보이스 뷰
- ✅ 모달 접근성 (포커스 트랩)

---

## 🎯 상세 작업 항목

### 6.1 주문 상세 모달

**파일:** `src/components/OrderDetailModal/OrderDetailModal.jsx`

```jsx
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/lib/http'
import './OrderDetailModal.css'

export default function OrderDetailModal({ orderId, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetcher(`/api/orders/${orderId}`)
  })

  // 포커스 트랩
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    modal.addEventListener('keydown', handleTab)
    modal.addEventListener('keydown', handleEscape)
    closeButtonRef.current?.focus()

    return () => {
      modal.removeEventListener('keydown', handleTab)
      modal.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">주문 상세</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="modal-close"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* 주문 정보 */}
          <section className="order-section">
            <h3>주문 정보</h3>
            <dl className="order-info">
              <dt>주문번호</dt>
              <dd>{order.order_number}</dd>
              <dt>주문일시</dt>
              <dd>{new Date(order.order_created_at).toLocaleString('ko-KR')}</dd>
              <dt>상태</dt>
              <dd>{order.order_status}</dd>
            </dl>
          </section>

          {/* 상품 목록 */}
          <section className="order-section">
            <h3>주문 상품</h3>
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.order_item_id} className="order-item">
                  <div className="item-name">{item.product_name}</div>
                  <div className="item-details">
                    {item.product_price.toLocaleString()}원 × {item.order_item_quantity}개
                  </div>
                  <div className="item-subtotal">
                    {item.order_item_subtotal.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 배송지 정보 */}
          <section className="order-section">
            <h3>배송지 정보</h3>
            <dl className="order-info">
              <dt>받는 분</dt>
              <dd>{order.order_recipient_name}</dd>
              <dt>연락처</dt>
              <dd>{order.order_recipient_phone}</dd>
              <dt>주소</dt>
              <dd>{order.order_recipient_address}</dd>
              {order.order_message && (
                <>
                  <dt>배송 메시지</dt>
                  <dd>{order.order_message}</dd>
                </>
              )}
            </dl>
          </section>

          {/* 결제 정보 */}
          <section className="order-section">
            <h3>결제 정보</h3>
            <dl className="payment-info">
              <dt>상품 금액</dt>
              <dd>{order.order_total_amount.toLocaleString()}원</dd>
              <dt>할인 금액</dt>
              <dd>-{order.order_discount_amount.toLocaleString()}원</dd>
              <dt className="total">최종 결제 금액</dt>
              <dd className="total">{order.order_subtotal_amount.toLocaleString()}원</dd>
            </dl>
          </section>

          {/* 타임라인 */}
          <section className="order-section">
            <h3>주문 진행 상황</h3>
            <div className="order-timeline">
              {/* 타임라인 표시 */}
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn--secondary">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 6.2 CSV 내보내기 유틸

**파일:** `src/utils/csv.ts`

```typescript
export function generateCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T; label: string }[]
): string {
  // 헤더 생성
  const headers = columns.map(col => col.label).join(',')

  // 데이터 행 생성
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key]
      // 쉼표나 줄바꿈이 있는 경우 따옴표로 감싸기
      const stringValue = String(value ?? '')
      return stringValue.includes(',') || stringValue.includes('\n')
        ? `"${stringValue}"`
        : stringValue
    }).join(',')
  )

  return [headers, ...rows].join('\n')
}

export function downloadCSV(csvContent: string, filename: string): void {
  // BOM 추가 (한글 깨짐 방지)
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
```

**사용 예시:**

```jsx
import { generateCSV, downloadCSV } from '@/utils/csv'

function OrdersPage() {
  const { data } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  })

  const handleExportCSV = () => {
    if (!data?.orders) return

    const columns = [
      { key: 'order_number', label: '주문번호' },
      { key: 'order_created_at', label: '주문일시' },
      { key: 'order_status', label: '상태' },
      { key: 'order_recipient_name', label: '받는 분' },
      { key: 'order_subtotal_amount', label: '결제금액' }
    ]

    const csv = generateCSV(data.orders, columns)
    const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csv, filename)
  }

  return (
    <button onClick={handleExportCSV} className="btn btn--secondary">
      CSV 내보내기
    </button>
  )
}
```

### 6.3 프린트 인보이스

**파일:** `src/components/OrderInvoice/OrderInvoice.jsx`

```jsx
import { forwardRef } from 'react'
import './OrderInvoice.css'

const OrderInvoice = forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="order-invoice">
      <div className="invoice-header">
        <h1>주문 명세서</h1>
        <div className="invoice-meta">
          <p>주문번호: {order.order_number}</p>
          <p>발행일: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </div>

      <section className="invoice-section">
        <h2>배송 정보</h2>
        <p>받는 분: {order.order_recipient_name}</p>
        <p>연락처: {order.order_recipient_phone}</p>
        <p>주소: {order.order_recipient_address}</p>
      </section>

      <section className="invoice-section">
        <h2>주문 상품</h2>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>단가</th>
              <th>수량</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.order_item_id}>
                <td>{item.product_name}</td>
                <td>{item.product_price.toLocaleString()}원</td>
                <td>{item.order_item_quantity}개</td>
                <td>{item.order_item_subtotal.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="invoice-section">
        <h2>결제 정보</h2>
        <table className="invoice-summary">
          <tbody>
            <tr>
              <th>상품 금액</th>
              <td>{order.order_total_amount.toLocaleString()}원</td>
            </tr>
            <tr>
              <th>할인 금액</th>
              <td>-{order.order_discount_amount.toLocaleString()}원</td>
            </tr>
            <tr className="total">
              <th>최종 결제 금액</th>
              <td>{order.order_subtotal_amount.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
})

OrderInvoice.displayName = 'OrderInvoice'
export default OrderInvoice
```

**프린트 스타일:**

```css
/* src/components/OrderInvoice/OrderInvoice.css */
@media print {
  body * {
    visibility: hidden;
  }

  .order-invoice,
  .order-invoice * {
    visibility: visible;
  }

  .order-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
  }

  .invoice-table th,
  .invoice-table td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }

  /* 페이지 나누기 방지 */
  .invoice-section {
    page-break-inside: avoid;
  }
}
```

**사용 예시:**

```jsx
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import OrderInvoice from '@/components/OrderInvoice'

function OrderDetailModal({ order }) {
  const invoiceRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current
  })

  return (
    <>
      <button onClick={handlePrint} className="btn btn--secondary">
        인쇄
      </button>

      <div style={{ display: 'none' }}>
        <OrderInvoice ref={invoiceRef} order={order} />
      </div>
    </>
  )
}
```

---

## 🔍 테스트 체크리스트

### 주문 상세 모달
- [ ] 모달 열림/닫힘 동작
- [ ] 포커스 트랩 동작
- [ ] ESC 키로 닫기
- [ ] 배경 클릭 시 닫기
- [ ] 모든 정보 올바르게 표시

### CSV 내보내기
- [ ] CSV 파일 다운로드
- [ ] 한글 정상 표시 (BOM)
- [ ] 쉼표 포함 데이터 처리

### 프린트
- [ ] 프린트 미리보기 동작
- [ ] 레이아웃 적절함
- [ ] 페이지 나누기 적절

---

## ✅ Definition of Done

- [ ] 주문 상세 모달 완성
- [ ] CSV 내보내기 동작
- [ ] 프린트 인보이스 구현
- [ ] 모달 접근성 (포커스 트랩, ESC)
- [ ] 반응형 디자인
- [ ] 프린트 전용 스타일 적용

---

## 📦 설치 패키지

```bash
npm install react-to-print
```

---

## 📚 참고 자료

- [Dialog Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [CSV Export Best Practices](https://en.wikipedia.org/wiki/Comma-separated_values)
- [Print Stylesheets](https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/)

---

## 🚨 주의사항

1. **포커스 트랩**: 모달 내부에서만 포커스 이동
2. **CSV BOM**: 한글 깨짐 방지 위해 BOM 필수
3. **프린트 스타일**: `@media print` 별도 작성
4. **접근성**: aria-modal, role 속성 필수
5. **성능**: 대량 데이터 CSV 생성 시 성능 고려
