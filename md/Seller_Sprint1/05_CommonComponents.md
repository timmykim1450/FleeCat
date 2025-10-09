# Task 5: 공통 컴포넌트 확장 (1일)

## 📋 개요
재사용 가능한 공통 컴포넌트 추가 및 개선

## 🎯 목표
- Badge, Select, DatePicker 컴포넌트 신규 생성
- Modal 컴포넌트 개선
- 일관된 디자인 시스템 유지

---

## 추가/개선할 공통 컴포넌트

### 1. Badge 컴포넌트 (신규)

#### 기능
- [ ] variant: success, danger, warning, info, default
- [ ] size: small, medium, large
- [ ] 사용처: 주문 상태, 상품 상태, 입금 상태

#### 사용 예시
```jsx
<Badge variant="success">판매중</Badge>
<Badge variant="danger">품절</Badge>
<Badge variant="warning">상품준비중</Badge>
<Badge variant="info">배송중</Badge>
```

#### Props 인터페이스
```javascript
{
  variant: 'success' | 'danger' | 'warning' | 'info' | 'default',
  size: 'small' | 'medium' | 'large',
  children: ReactNode
}
```

#### 파일 생성
```
src/components/common/Badge/
├── Badge.jsx
├── Badge.css
└── index.js
```

---

### 2. Select 컴포넌트 (신규)

#### 기능
- [ ] label, error 지원
- [ ] placeholder
- [ ] options (배열)
- [ ] disabled 상태
- [ ] 사용처: 카테고리, 택배사, 상태 필터

#### 사용 예시
```jsx
<Select
  label="카테고리"
  options={categories}
  value={category}
  onChange={setCategory}
  placeholder="카테고리를 선택하세요"
  error={errors.category}
/>
```

#### Props 인터페이스
```javascript
{
  label?: string,
  options: Array<{ value: string, label: string }>,
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
  error?: string,
  disabled?: boolean
}
```

#### 파일 생성
```
src/components/common/Select/
├── Select.jsx
├── Select.css
└── index.js
```

---

### 3. DatePicker 컴포넌트 (신규)

#### 기능
- [ ] 단일 날짜 선택
- [ ] 날짜 범위 선택
- [ ] 빠른 선택 버튼 (오늘/1주일/1개월)
- [ ] 사용처: 기간 필터, 월별 리포트

#### 사용 예시
```jsx
<DatePicker
  value={date}
  onChange={setDate}
  quickSelect={['today', 'week', 'month']}
/>

<DatePicker
  mode="range"
  startDate={startDate}
  endDate={endDate}
  onRangeChange={(start, end) => {
    setStartDate(start);
    setEndDate(end);
  }}
/>
```

#### Props 인터페이스
```javascript
{
  mode?: 'single' | 'range',
  value?: Date,
  onChange?: (date: Date) => void,
  startDate?: Date,
  endDate?: Date,
  onRangeChange?: (start: Date, end: Date) => void,
  quickSelect?: Array<'today' | 'week' | 'month' | '3months'>,
  minDate?: Date,
  maxDate?: Date
}
```

#### 파일 생성
```
src/components/common/DatePicker/
├── DatePicker.jsx
├── DatePicker.css
└── index.js
```

---

### 4. Modal 컴포넌트 (개선)

#### 개선 사항
- [ ] size: small, medium, large, full
- [ ] closeOnOverlay (배경 클릭 시 닫기 옵션)
- [ ] 헤더/푸터 슬롯
- [ ] 스크롤 핸들링

#### 사용 예시
```jsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  size="large"
  title="상품 등록"
  closeOnOverlay={true}
  footer={
    <div className="modal-footer">
      <Button variant="secondary" onClick={onClose}>취소</Button>
      <Button variant="primary" onClick={onSubmit}>저장</Button>
    </div>
  }
>
  {children}
</Modal>
```

#### Props 인터페이스
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  title?: string,
  size?: 'small' | 'medium' | 'large' | 'full',
  closeOnOverlay?: boolean,
  footer?: ReactNode,
  children: ReactNode
}
```

#### 파일 수정
```
src/components/common/Modal/
├── Modal.jsx (개선)
├── Modal.css (개선)
└── index.js
```

---

### 5. Table 컴포넌트 (신규 - 선택)

#### 우선순위
- **낮음** (시간 부족 시 SKIP)

#### 기능
- [ ] 공통 테이블 래퍼
- [ ] 정렬, 체크박스, 반응형 지원
- [ ] 재사용 가능한 테이블 구조

#### 비고
각 페이지에서 개별 테이블 구현 후, 패턴이 명확해지면 공통화

---

## 작업 순서

### 오전
1. **Badge 컴포넌트** (1시간)
   - 컴포넌트 생성
   - 5가지 variant 스타일
   - 3가지 size 스타일
   - 테스트

2. **Select 컴포넌트** (1.5시간)
   - 컴포넌트 생성
   - label, error 스타일
   - options 렌더링
   - 테스트

### 오후
3. **DatePicker 컴포넌트** (2시간)
   - 단일/범위 모드
   - 빠른 선택 버튼
   - 달력 UI
   - 테스트

4. **Modal 개선** (1시간)
   - size variants
   - footer 슬롯
   - closeOnOverlay
   - 테스트

5. **문서화 & 통합** (0.5시간)
   - 각 컴포넌트 사용 예시
   - 스토리북 (옵션)
   - 기존 컴포넌트와 통합 테스트

---

## ✅ 완료 기준

- [ ] Badge 컴포넌트 완성 (5 variants, 3 sizes)
- [ ] Select 컴포넌트 완성 (label, error, disabled 지원)
- [ ] DatePicker 컴포넌트 완성 (단일/범위, 빠른 선택)
- [ ] Modal 개선 완료 (size, footer, closeOnOverlay)
- [ ] 모든 컴포넌트 반응형 지원
- [ ] 일관된 디자인 시스템 적용

## 📁 최종 파일 구조
```
src/components/common/
├── Badge/
│   ├── Badge.jsx
│   ├── Badge.css
│   └── index.js
├── Select/
│   ├── Select.jsx
│   ├── Select.css
│   └── index.js
├── DatePicker/
│   ├── DatePicker.jsx
│   ├── DatePicker.css
│   └── index.js
└── Modal/ (개선)
    ├── Modal.jsx
    ├── Modal.css
    └── index.js
```

## 🎨 디자인 시스템 변수

### 색상 (CSS Variables)
```css
/* Badge Colors */
--badge-success: #10b981;
--badge-danger: #ef4444;
--badge-warning: #f59e0b;
--badge-info: #3b82f6;
--badge-default: #6b7280;

/* Badge Background */
--badge-success-bg: #d1fae5;
--badge-danger-bg: #fee2e2;
--badge-warning-bg: #fef3c7;
--badge-info-bg: #dbeafe;
--badge-default-bg: #f3f4f6;
```

### 크기
```css
/* Badge Sizes */
--badge-small: 0.75rem;
--badge-medium: 0.875rem;
--badge-large: 1rem;

/* Modal Sizes */
--modal-small: 400px;
--modal-medium: 600px;
--modal-large: 800px;
--modal-full: 95vw;
```

## 🔗 관련 문서
- [00_Overview.md](00_Overview.md)
- [01_SellerDashboard.md](01_SellerDashboard.md)
- [02_SellerProducts.md](02_SellerProducts.md)
- [03_SellerOrders.md](03_SellerOrders.md)
- [04_SellerRevenue.md](04_SellerRevenue.md)
