# Task 4: SellerRevenue (2일)

## 📋 개요
판매자 정산 관리 페이지 - 정산 대기/완료 및 월별 리포트

## 🎯 목표
- 정산 대기 금액 및 주문 목록
- 정산 완료 내역 조회
- 월별 매출 리포트 및 차트

---

## Day 1: 정산 대기 & 정산 완료

### 작업 항목

#### 1. SellerRevenue 메인 레이아웃
- [ ] 3개 탭: 정산 대기 / 정산 완료 / 월별 리포트

#### 2. PendingSettlement 컴포넌트 (정산 대기)
- [ ] 정산 대기 금액 카드 (큰 숫자)
  - [ ] 금액
  - [ ] 정산 예정일
  - [ ] 주문 건수
- [ ] 정산 대기 주문 목록 (테이블)
  - [ ] 주문번호
  - [ ] 주문일
  - [ ] 상품명
  - [ ] 판매 금액
  - [ ] 수수료 (10%)
  - [ ] 실수령액
- [ ] 합계 표시

#### 3. CompletedSettlement 컴포넌트 (정산 완료)
- [ ] 정산 완료 목록 (테이블)
  - [ ] 정산일
  - [ ] 정산 기간
  - [ ] 총 매출
  - [ ] 총 수수료
  - [ ] 실수령액
  - [ ] 입금 상태 (Badge: 입금완료/입금대기)
  - [ ] 상세 보기 버튼
- [ ] 페이지네이션

#### 4. Mock 데이터
```javascript
// 정산 대기
const pendingSettlement = {
  totalAmount: 4500000,
  expectedDate: '2025-01-15',
  orderCount: 15,
  orders: [
    {
      orderId: 'ORD-20250108-001',
      orderDate: '2025-01-08',
      productName: '프리미엄 무선 이어폰',
      salesAmount: 89000,
      fee: 8900, // 10%
      netAmount: 80100
    },
    // ... 14건 더
  ]
};

// 정산 완료
const completedSettlements = [
  {
    id: 1,
    settlementDate: '2025-01-01',
    period: '2024-12-15 ~ 2024-12-31',
    totalSales: 12500000,
    totalFee: 1250000,
    netAmount: 11250000,
    depositStatus: 'completed', // completed, pending
  },
  // ... 7건 더
];
```

### 파일 생성
```
Seller/SellerRevenue/
├── SellerRevenue.jsx
├── SellerRevenue.css
├── PendingSettlement.jsx
├── PendingSettlement.css
├── CompletedSettlement.jsx
├── CompletedSettlement.css
└── index.js
```

---

## Day 2: 월별 리포트 & 마무리

### 작업 항목

#### 1. MonthlyReport 컴포넌트
- [ ] 연/월 선택 (DatePicker)
- [ ] 요약 카드 (4개)
  - [ ] 총 매출
  - [ ] 총 수수료
  - [ ] 실수령액
  - [ ] 주문 건수

#### 2. RevenueChart 컴포넌트
- [ ] 일별 매출 Line Chart
  - [ ] X축: 날짜 (1일~31일)
  - [ ] Y축: 매출액
- [ ] 카테고리별 매출 (Pie Chart)
  - [ ] 각 카테고리별 비율
  - [ ] 레이블 + 퍼센트

#### 3. 엑셀 다운로드 버튼
- [ ] 버튼만 구현 (클릭 시 Toast "준비 중입니다")
- [ ] 실제 다운로드 기능 X

#### 4. Mock 데이터
```javascript
const monthlyReport = {
  year: 2025,
  month: 1,
  summary: {
    totalSales: 8500000,
    totalFee: 850000,
    netAmount: 7650000,
    orderCount: 47
  },
  dailySales: [
    { date: 1, sales: 250000 },
    { date: 2, sales: 320000 },
    // ... 31일치
  ],
  categoryBreakdown: [
    { category: '전자기기', amount: 3400000, percentage: 40 },
    { category: '의류', amount: 2550000, percentage: 30 },
    { category: '뷰티', amount: 1700000, percentage: 20 },
    { category: '기타', amount: 850000, percentage: 10 }
  ]
};
```

#### 5. 스타일링 & 반응형

#### 6. 테스트
- [ ] 3개 탭 전환 동작
- [ ] 차트 정상 표시
- [ ] 날짜 선택 기능

### 파일 생성
```
├── MonthlyReport.jsx
├── MonthlyReport.css
├── RevenueChart.jsx
└── RevenueChart.css
```

---

## ✅ 완료 기준

- [ ] 정산 대기 목록 및 금액 표시
- [ ] 정산 완료 목록 표시
- [ ] 월별 리포트 (요약 + 일별 차트 + 카테고리 차트)
- [ ] 반응형 정상 작동

## 📁 최종 파일 구조
```
Seller/SellerRevenue/
├── SellerRevenue.jsx
├── SellerRevenue.css
├── PendingSettlement.jsx
├── PendingSettlement.css
├── CompletedSettlement.jsx
├── CompletedSettlement.css
├── MonthlyReport.jsx
├── MonthlyReport.css
├── RevenueChart.jsx
├── RevenueChart.css
└── index.js
```

## 🔗 관련 문서
- [00_Overview.md](00_Overview.md)
- [05_CommonComponents.md](05_CommonComponents.md) - Badge, DatePicker
- [01_SellerDashboard.md](01_SellerDashboard.md) - 차트 참고
- [07_Schedule.md](07_Schedule.md)
