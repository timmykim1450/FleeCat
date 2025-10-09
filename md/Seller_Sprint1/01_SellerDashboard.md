# Task 1: SellerDashboard (3일)

## 📋 개요
판매자 대시보드 구현 - 통계 카드, 매출 그래프, 인기 상품

## 🎯 목표
- 핵심 지표 시각화
- 비즈니스 인사이트 제공
- 빠른 액션 버튼 제공

---

## Day 1: 레이아웃 & 통계 카드

### 작업 항목

#### 1. 대시보드 레이아웃 구성
- [ ] 4x1 그리드 (통계 카드 4개)
- [ ] 2x1 그리드 (그래프 영역)
- [ ] 반응형 레이아웃 (모바일: 세로 스택)

#### 2. StatCard 컴포넌트 생성
- [ ] 오늘 판매액
- [ ] 주문 건수
- [ ] 방문자 수
- [ ] 전환율
- [ ] 아이콘 + 숫자 + 전일 대비 증감률 (▲ 5.2% / ▼ 2.1%)
- [ ] 증감률 색상 (증가: green / 감소: red)

#### 3. Mock 데이터 준비
```javascript
const dashboardStats = {
  todaySales: { value: 1250000, change: 5.2 },
  orderCount: { value: 47, change: -2.1 },
  visitors: { value: 1234, change: 12.3 },
  conversionRate: { value: 3.8, change: 0.5 }
};
```

### 파일 생성
```
Seller/SellerDashboard/
├── SellerDashboard.jsx
├── SellerDashboard.css
├── StatCard.jsx
├── StatCard.css
└── index.js
```

---

## Day 2: 매출 그래프

### 작업 항목

#### 1. 차트 라이브러리 설치
```bash
npm install recharts
```

#### 2. SalesChart 컴포넌트 생성
- [ ] 일/주/월 탭 필터
- [ ] Line Chart 구현
  - [ ] X축: 날짜
  - [ ] Y축: 매출액 (원)
  - [ ] Tooltip 표시 (날짜 + 금액)
  - [ ] Gradient 배경 (옵션)
- [ ] 반응형 차트 크기

#### 3. Mock 데이터 생성
- [ ] 일별: 7일치
- [ ] 주별: 4주치
- [ ] 월별: 12개월치

```javascript
const salesData = {
  daily: [
    { date: '01/01', sales: 350000 },
    { date: '01/02', sales: 420000 },
    // ... 7일치
  ],
  weekly: [
    { week: 'Week 1', sales: 2100000 },
    // ... 4주치
  ],
  monthly: [
    { month: 'Jan', sales: 8500000 },
    // ... 12개월치
  ]
};
```

### 파일 생성
```
├── SalesChart.jsx
└── SalesChart.css
```

---

## Day 3: 인기 상품 & 마무리

### 작업 항목

#### 1. TopProducts 컴포넌트 생성
- [ ] 테이블 형태
  - [ ] 순위 (1~5)
  - [ ] 썸네일 이미지
  - [ ] 상품명
  - [ ] 판매량
  - [ ] 매출액
- [ ] 모바일: 카드 형태로 변환

#### 2. 빠른 액션 버튼 영역
- [ ] "상품 등록하기" 버튼 → SellerProducts로 이동
- [ ] "주문 확인하기" 버튼 → SellerOrders로 이동

#### 3. 스타일링 & 반응형 테스트
- [ ] 데스크톱 레이아웃
- [ ] 태블릿 (768px)
- [ ] 모바일 (480px)

#### 4. Mock 데이터 (인기 상품 10개)
```javascript
const topProducts = [
  {
    rank: 1,
    id: 1,
    name: '프리미엄 무선 이어폰',
    thumbnail: '/images/product1.jpg',
    salesCount: 234,
    revenue: 23400000
  },
  // ... 9개 더
];
```

### 파일 생성
```
├── TopProducts.jsx
└── TopProducts.css
```

---

## ✅ 완료 기준

- [ ] 통계 카드 4개 정상 표시
- [ ] 매출 그래프 3가지 기간 전환 동작
- [ ] 인기 상품 TOP 5 표시
- [ ] 반응형 정상 작동 (768px, 480px)
- [ ] 빠른 액션 버튼 네비게이션 동작

## 📁 최종 파일 구조
```
Seller/SellerDashboard/
├── SellerDashboard.jsx
├── SellerDashboard.css
├── StatCard.jsx
├── StatCard.css
├── SalesChart.jsx
├── SalesChart.css
├── TopProducts.jsx
├── TopProducts.css
└── index.js
```

## 🔗 관련 문서
- [00_Overview.md](00_Overview.md)
- [05_CommonComponents.md](05_CommonComponents.md) - Badge 컴포넌트
- [07_Schedule.md](07_Schedule.md)
