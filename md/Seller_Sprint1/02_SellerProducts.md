# Task 2: SellerProducts (4일)

## 📋 개요
판매자 상품 관리 페이지 - CRUD 기능 완성

## 🎯 목표
- 상품 목록 조회 (필터, 검색, 정렬)
- 상품 등록/수정 폼
- 일괄 관리 기능

---

## Day 1: 상품 목록 테이블

### 작업 항목

#### 1. SellerProducts 메인 레이아웃
- [ ] 상단: 검색/필터 + "상품 등록" 버튼
- [ ] 중단: 테이블
- [ ] 하단: 페이지네이션

#### 2. ProductTable 컴포넌트
- [ ] 테이블 컬럼
  - [ ] 체크박스 (전체 선택)
  - [ ] 썸네일 (50x50px)
  - [ ] 상품명
  - [ ] 카테고리
  - [ ] 가격
  - [ ] 재고
  - [ ] 상태 (Badge)
  - [ ] 액션 (수정/삭제 버튼)
- [ ] 정렬 기능
  - [ ] 최신순 / 가격높은순 / 가격낮은순
- [ ] 상태 배지
  - [ ] 판매중 (green)
  - [ ] 품절 (red)
  - [ ] 비공개 (gray)

#### 3. ProductFilters 컴포넌트
- [ ] 검색어 입력 (상품명)
- [ ] 카테고리 Select
- [ ] 상태 Select (전체/판매중/품절/비공개)

#### 4. 페이지네이션 (10개씩)

#### 5. Mock 데이터 (상품 25개)
```javascript
const mockProducts = [
  {
    id: 1,
    name: '프리미엄 무선 이어폰',
    category: '전자기기',
    price: 89000,
    stock: 45,
    status: 'active', // active, soldout, inactive
    thumbnail: '/images/product1.jpg'
  },
  // ... 24개 더
];
```

### 파일 생성
```
Seller/SellerProducts/
├── SellerProducts.jsx
├── SellerProducts.css
├── ProductTable.jsx
├── ProductTable.css
├── ProductFilters.jsx
├── ProductFilters.css
└── index.js
```

---

## Day 2: 상품 등록 폼 (1/2)

### 작업 항목

#### 1. ProductForm 컴포넌트 생성
- [ ] 모달 형태 (큰 모달)
- [ ] 제목: "상품 등록" / "상품 수정"

#### 2. 기본 정보 섹션
- [ ] 상품명 (Input - required)
- [ ] 카테고리 (Select - required)
  - [ ] 옵션: 의류, 전자기기, 식품, 도서, 뷰티, 기타
- [ ] 가격 (Input - number, required)
- [ ] 할인가 (Input - number, optional)
- [ ] 재고 수량 (Input - number, required)

#### 3. ImageUpload 컴포넌트
- [ ] 대표 이미지 업로드 (1개 필수)
  - [ ] File input
  - [ ] 미리보기 (이미지 or 플레이스홀더)
  - [ ] 삭제 버튼
- [ ] 추가 이미지 (최대 5개)
  - [ ] 드래그 앤 드롭 영역
  - [ ] 미리보기 그리드
- [ ] **주의: 실제 업로드 X, Base64 미리보기만**

#### 4. 유효성 검사
- [ ] 필수 필드 체크
- [ ] 가격 > 0
- [ ] 재고 >= 0

### 파일 생성
```
├── ProductForm.jsx
├── ProductForm.css
├── ImageUpload.jsx
└── ImageUpload.css
```

---

## Day 3: 상품 등록 폼 (2/2) & 수정

### 작업 항목

#### 1. 상세 정보 섹션
- [ ] 상품 설명 (Textarea, required)
  - [ ] 최소 10자 이상
- [ ] 배송비 (Radio)
  - [ ] 무료배송
  - [ ] 유료배송 (금액 입력)
- [ ] 원산지 (Input)
- [ ] 제조사 (Input)

#### 2. 옵션 관리 (선택 기능)
- [ ] "옵션 사용" 체크박스
- [ ] 옵션 추가 버튼
- [ ] 옵션 목록
  - [ ] 옵션명 (예: 색상-빨강)
  - [ ] 추가 금액
  - [ ] 재고
  - [ ] 삭제 버튼

#### 3. 저장/취소 버튼
- [ ] 저장 → Mock 데이터 추가
- [ ] 취소 → 모달 닫기

#### 4. 상품 수정 기능
- [ ] 기존 ProductForm 재사용
- [ ] 기존 데이터 로드
- [ ] 수정 → Mock 데이터 업데이트

---

## Day 4: 삭제 & 일괄 관리 & 마무리

### 작업 항목

#### 1. 상품 삭제
- [ ] 삭제 버튼 클릭 → 확인 모달
- [ ] 확인 → Mock 데이터에서 제거

#### 2. 일괄 관리 기능
- [ ] 체크박스 다중 선택
- [ ] 상단 일괄 액션 버튼
  - [ ] 선택 항목 삭제
  - [ ] 선택 항목 상태 변경 (판매중/품절/비공개)
- [ ] 전체 선택/해제

#### 3. 스타일링 & 반응형
- [ ] 모바일: 테이블 → 카드 리스트

#### 4. 테스트
- [ ] CRUD 모든 기능 동작 확인
- [ ] 유효성 검사 확인

---

## ✅ 완료 기준

- [ ] 상품 목록 조회 (정렬, 필터, 검색, 페이지네이션)
- [ ] 상품 등록 (기본 정보 + 이미지 + 상세 정보)
- [ ] 상품 수정 (기존 데이터 로드 + 수정)
- [ ] 상품 삭제 (단일 + 일괄)
- [ ] 상태 변경 (일괄)
- [ ] 반응형 정상 작동

## 📁 최종 파일 구조
```
Seller/SellerProducts/
├── SellerProducts.jsx
├── SellerProducts.css
├── ProductTable.jsx
├── ProductTable.css
├── ProductFilters.jsx
├── ProductFilters.css
├── ProductForm.jsx
├── ProductForm.css
├── ImageUpload.jsx
├── ImageUpload.css
└── index.js
```

## 🔗 관련 문서
- [00_Overview.md](00_Overview.md)
- [05_CommonComponents.md](05_CommonComponents.md) - Badge, Select, Modal
- [07_Schedule.md](07_Schedule.md)
