# Task 3: SellerOrders (3일)

## 📋 개요
판매자 주문 관리 페이지 - 주문 조회 및 배송 관리

## 🎯 목표
- 주문 목록 조회 및 필터링
- 주문 상세 정보 확인
- 배송 상태 관리
- 취소/환불 처리

---

## Day 1: 주문 목록

### 작업 항목

#### 1. SellerOrders 메인 레이아웃
- [ ] 상단: 필터/검색
- [ ] 중단: 주문 테이블/카드
- [ ] 하단: 페이지네이션

#### 2. OrderTable 컴포넌트
- [ ] 테이블 컬럼
  - [ ] 주문번호
  - [ ] 주문일시
  - [ ] 구매자명
  - [ ] 상품명 (대표 상품 + n개)
  - [ ] 금액
  - [ ] 주문 상태 (Badge)
  - [ ] 액션 (상세보기 버튼)
- [ ] 주문 상태 배지
  - [ ] 결제완료 (blue)
  - [ ] 상품준비중 (orange)
  - [ ] 배송중 (purple)
  - [ ] 배송완료 (green)
  - [ ] 취소/환불 (red)

#### 3. OrderFilters 컴포넌트
- [ ] 기간 필터 (오늘/1주일/1개월/3개월)
- [ ] 상태 필터 (전체/결제완료/상품준비중/배송중/배송완료/취소환불)
- [ ] 검색 (주문번호, 구매자명)

#### 4. 페이지네이션 (15개씩)

#### 5. Mock 데이터 (주문 40건)
```javascript
const mockOrders = [
  {
    id: 'ORD-20250108-001',
    orderDate: '2025-01-08 14:32:15',
    customerName: '김철수',
    products: [
      { name: '프리미엄 무선 이어폰', quantity: 1 },
      { name: '스마트워치', quantity: 1 }
    ],
    totalAmount: 189000,
    status: 'paid', // paid, preparing, shipping, delivered, cancelled
  },
  // ... 39건 더
];
```

### 파일 생성
```
Seller/SellerOrders/
├── SellerOrders.jsx
├── SellerOrders.css
├── OrderTable.jsx
├── OrderTable.css
├── OrderFilters.jsx
├── OrderFilters.css
└── index.js
```

---

## Day 2: 주문 상세 & 배송 관리

### 작업 항목

#### 1. OrderDetailModal 컴포넌트
- [ ] 구매자 정보
  - [ ] 이름
  - [ ] 연락처
  - [ ] 이메일
- [ ] 배송지 정보
  - [ ] 수령인
  - [ ] 주소
  - [ ] 연락처
  - [ ] 배송 메모
- [ ] 주문 상품 목록
  - [ ] 상품명, 옵션, 수량, 가격
- [ ] 결제 정보
  - [ ] 상품 금액
  - [ ] 배송비
  - [ ] 할인 금액
  - [ ] 최종 결제 금액
- [ ] 주문 타임라인
  - [ ] 결제완료 → 상품준비중 → 배송중 → 배송완료
  - [ ] 각 단계별 날짜/시간

#### 2. ShippingForm 컴포넌트
- [ ] 배송 상태 변경 버튼
  - [ ] "배송 시작" (상품준비중 → 배송중)
  - [ ] "배송 완료" (배송중 → 배송완료)
- [ ] 송장 정보 입력
  - [ ] 택배사 Select (CJ대한통운, 우체국, 롯데택배, 한진택배)
  - [ ] 송장번호 Input
  - [ ] 저장 버튼
- [ ] 변경 확인 모달

### Mock 데이터 확장
```javascript
const orderDetail = {
  ...mockOrder,
  customer: {
    name: '김철수',
    phone: '010-1234-5678',
    email: 'customer@example.com'
  },
  shipping: {
    recipient: '김철수',
    address: '서울시 강남구 테헤란로 123',
    phone: '010-1234-5678',
    memo: '부재시 경비실에 맡겨주세요'
  },
  payment: {
    productAmount: 178000,
    shippingFee: 3000,
    discount: 0,
    totalAmount: 181000
  },
  timeline: [
    { status: 'paid', timestamp: '2025-01-08 14:32:15' },
    { status: 'preparing', timestamp: '2025-01-08 15:20:00' },
    { status: 'shipping', timestamp: '2025-01-09 10:00:00' },
    { status: 'delivered', timestamp: '2025-01-10 14:30:00' }
  ],
  tracking: {
    courier: 'CJ대한통운',
    trackingNumber: '123456789012'
  }
};
```

### 파일 생성
```
├── OrderDetailModal.jsx
├── OrderDetailModal.css
├── ShippingForm.jsx
└── ShippingForm.css
```

---

## Day 3: 취소/환불 & 메모 & 마무리

### 작업 항목

#### 1. 취소/환불 요청 처리
- [ ] 별도 탭 추가 ("취소/환불 요청")
- [ ] 요청 목록
  - [ ] 주문번호, 상품명, 요청 사유, 요청일
- [ ] 승인/거부 버튼
  - [ ] 승인 → 상태를 "취소/환불"로 변경
  - [ ] 거부 → 거부 사유 입력 모달

#### 2. 주문 메모 기능
- [ ] OrderDetailModal에 메모 섹션 추가
- [ ] 판매자 전용 메모 (구매자에게 보이지 않음)
- [ ] 메모 작성/수정/삭제

#### 3. 스타일링 & 반응형
- [ ] 모바일: 테이블 → 카드

#### 4. 테스트
- [ ] 주문 조회 (필터, 검색, 페이지네이션)
- [ ] 주문 상세 확인
- [ ] 배송 상태 변경
- [ ] 취소/환불 처리

---

## ✅ 완료 기준

- [ ] 주문 목록 조회 (필터, 검색, 페이지네이션)
- [ ] 주문 상세 모달 (구매자 정보, 배송지, 상품, 결제, 타임라인)
- [ ] 배송 상태 변경 (송장 입력)
- [ ] 취소/환불 요청 처리
- [ ] 주문 메모 작성
- [ ] 반응형 정상 작동

## 📁 최종 파일 구조
```
Seller/SellerOrders/
├── SellerOrders.jsx
├── SellerOrders.css
├── OrderTable.jsx
├── OrderTable.css
├── OrderFilters.jsx
├── OrderFilters.css
├── OrderDetailModal.jsx
├── OrderDetailModal.css
├── ShippingForm.jsx
├── ShippingForm.css
└── index.js
```

## 🔗 관련 문서
- [00_Overview.md](00_Overview.md)
- [05_CommonComponents.md](05_CommonComponents.md) - Badge, Select, DatePicker
- [07_Schedule.md](07_Schedule.md)
