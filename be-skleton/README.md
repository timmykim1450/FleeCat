# Fleecat 멀티테넌트 쇼핑몰 플랫폼

> 여러 공방(판매사)이 하나의 플랫폼에서 독립적으로 상품을 판매할 수 있는 멀티테넌트 이커머스 백엔드 API

**개발 기간**: 2025년 10월 1일 ~ 진행 중
**기술 스택**: Node.js, Express, Prisma, PostgreSQL (Supabase), JWT
**아키텍처**: Layered Architecture (Repository Pattern)

---

## 📖 프로젝트 개요

### 핵심 컨셉

Fleecat은 **멀티테넌트 쇼핑몰 플랫폼**으로, 여러 공방(판매사)이 하나의 플랫폼에서 독립적으로 운영되면서도 통합된 사용자 경험을 제공합니다.

### 주요 특징

1. **멀티테넌시 (Multi-Tenancy)**
   - 한 플랫폼에 여러 판매사(Tenant) 공존
   - 판매사별 데이터 격리 및 독립적 운영
   - 한 회원이 여러 판매사에 소속 가능

2. **유연한 권한 관리**
   - 구매자(Buyer), 판매자(Seller), 관리자(Admin) 역할 구분
   - 판매사별 구성원(TenantMember) 승인 시스템
   - 세밀한 권한 제어 (상품 관리, 주문 처리 등)

3. **계층형 카테고리**
   - 대분류 → 중분류 → 소분류 구조
   - 자기 참조(Self-referencing) 관계
   - 동적 경로(Path) 자동 생성

4. **완전한 이커머스 기능**
   - 회원 관리 (개인/기업 구분)
   - 상품 관리 (이미지, 재고, 가격)
   - 장바구니 및 주문
   - 쿠폰 및 결제
   - 배송지 관리

---

## 🏗️ 아키텍처

### 레이어드 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────────┐
│           Routes (API Endpoints)        │  ← HTTP 요청 수신, 라우팅
├─────────────────────────────────────────┤
│      Middleware (Auth, Validation)      │  ← 인증, 검증, 에러 처리
├─────────────────────────────────────────┤
│     Controllers (Request Handlers)      │  ← HTTP 요청/응답 처리
├─────────────────────────────────────────┤
│      Services (Business Logic)          │  ← 비즈니스 로직, 트랜잭션
├─────────────────────────────────────────┤
│    Repositories (Data Access Layer)     │  ← 데이터베이스 접근
├─────────────────────────────────────────┤
│      Prisma ORM (Query Builder)         │  ← SQL 쿼리 생성
├─────────────────────────────────────────┤
│    PostgreSQL Database (Supabase)       │  ← 데이터 저장
└─────────────────────────────────────────┘
```

### 주요 원칙

- **관심사의 분리**: 각 레이어는 명확한 책임을 가짐
- **의존성 역전**: 상위 레이어가 하위 레이어에 의존
- **Repository 패턴**: 데이터 접근 로직을 캡슐화
- **단일 책임 원칙**: 각 함수와 파일은 하나의 책임만 가짐

---

## 🔑 핵심 개념

### 1. 멀티테넌시 구조

**Tenant (판매사/공방)**
- 플랫폼 내 독립적인 판매 단위
- 예: "홍길동 도자기 공방", "김철수 목공예 공방"

**TenantMember (판매사 구성원)**
- 회원과 판매사를 연결하는 중간 테이블
- 한 회원이 여러 판매사에 소속 가능
- 역할(Role): owner, manager, staff

**관계 구조**:
```
Member (회원)
  ↓ N:N (다대다)
TenantMember (구성원)
  ↓ 1:N (일대다)
Product (상품)
```

**핵심 포인트**:
- 상품은 Tenant가 아닌 **TenantMember**에 속함
- 한 회원이 "A공방"과 "B공방"에서 각각 다른 상품을 판매 가능
- 판매사별 데이터 격리를 통해 독립성 보장

---

### 2. 승인 프로세스 (Approval Process)

**2단계 승인 시스템**:

```
1단계: 판매사 승인 (관리자)
회원 → 판매사 등록 신청 (pending)
      ↓
관리자 → 승인(approved) / 거절(rejected)

2단계: 구성원 승인 (판매사 Owner)
회원 → 판매사 가입 신청 (pending)
      ↓
판매사 Owner → 승인(approved) / 거절(rejected)
```

**승인 후 권한**:
- 판매사 승인: 구성원 모집 가능
- 구성원 승인: 상품 등록 및 관리 가능

---

### 3. 계층형 카테고리

**자기 참조 구조** (Self-Referencing):
```
category
  ├─ category_id (PK)
  ├─ parent_category_id (FK → category_id)
  ├─ category_path (자동 생성)
  └─ category_depth (1, 2, 3...)
```

**경로 자동 생성**:
- 대분류 (ID: 1): `path = "1"`
- 중분류 (ID: 5): `path = "1/5"` (부모: 1)
- 소분류 (ID: 12): `path = "1/5/12"` (부모: 5)

**계층 조회**:
- 부모 카테고리를 기준으로 자식 카테고리를 재귀적으로 조회
- 전체 트리 구조를 한 번에 반환 가능

---

### 4. JWT 인증 시스템

**토큰 기반 인증**:
```
1. 로그인 → JWT 토큰 발급
2. 요청 시 Authorization 헤더에 토큰 포함
3. 미들웨어에서 토큰 검증
4. 검증 성공 시 req.user에 사용자 정보 저장
```

**권한 체크**:
- `authenticate`: 로그인 여부 확인
- `authorize(role)`: 특정 역할 확인
- Custom 미들웨어: 세부 권한 확인 (owner, 본인 등)

**토큰 페이로드**:
```javascript
{
  member_id: 123,
  email: "user@example.com",
  role: "seller",
  roles: ["buyer", "seller"]
}
```

---

### 5. 데이터베이스 설계 원칙

**네이밍 규칙**:
- 테이블명: 단수형 소문자 (`member`, `product`)
- 컬럼명: `{테이블}_{컬럼}` 형식 (`member_email`, `product_price`)
- Primary Key: `{테이블}_id` (`member_id`, `tenant_id`)
- Foreign Key: `{참조테이블}_id` (`company_id`, `category_id`)

**타임스탬프**:
- 모든 테이블에 `{테이블}_created_at`, `{테이블}_updated_at` 필수
- Prisma `@updatedAt`로 자동 갱신

**CASCADE 정책**:
- **CASCADE DELETE**: `member_address`, `product_img`, `shopping_cart`
  - 부모 삭제 시 자식도 함께 삭제 (1:N 관계)
- **RESTRICT**: `order`, `payment`
  - 주문/결제 이력은 보존 (법적 요구사항)
- **SET NULL**: `coupon_id` in `order`
  - 쿠폰 삭제 시 주문은 유지, 쿠폰만 NULL

---

## 📊 개발 진행 현황

### Phase 1: 기초 인프라 구축 ✅ **완료**

**목표**: 회원 가입부터 로그인까지 기본 인증/인가 시스템 구축

**구현 완료** (2025.10.01 ~ 2025.10.02):
- ✅ 회원가입 API (개인/기업 구분)
- ✅ 로그인 API (JWT 토큰 발급)
- ✅ 비밀번호 변경 API
- ✅ 내 정보 조회 API
- ✅ 내 정보 수정 API

**주요 성과**:
- 13개 Step 모두 완료 (100%)
- 5개 Critical 버그 발견 및 수정
- 12개 테스트 케이스 완료 (통과율 100%)
- 16개 문서 작성 완료

**발견 및 수정된 버그**:
1. Prisma 관계 필드명 오류 (`member_permission` → `member_permissions`) - 3곳
2. BigInt 직렬화 오류 (관계 데이터 미제거) - 2곳

---

### Phase 2: 판매자 기능 구축 📋 **계획 수립 완료**

**목표**: 판매사 등록부터 상품 등록까지 멀티테넌트 핵심 기능 구축

**계획된 작업** (14개 Step):

**Repository Layer** (6개):
1. Tenant Repository - 판매사 데이터 접근
2. TenantDetail Repository - 판매사 상세 정보
3. TenantMember Repository - 판매사 구성원 관리
4. Category Repository - 계층형 카테고리
5. Product Repository - 상품 관리
6. ProductImg Repository - 상품 이미지

**Service Layer** (4개):
7. Tenant Service - 판매사 비즈니스 로직
8. TenantMember Service - 구성원 비즈니스 로직
9. Category Service - 카테고리 비즈니스 로직
10. Product Service - 상품 비즈니스 로직

**Controller & Routes** (3개):
11. Controllers - HTTP 요청/응답 처리
12. Validation Middleware - 입력 검증
13. Routes - API 엔드포인트 정의

**Testing** (1개):
14. 테스트 및 문서화 - 수동 테스트 및 결과 문서

**예정 API** (21개):
- Tenant 관리: 5개
- TenantMember 관리: 4개
- Category 관리: 5개
- Product 관리: 6개
- 이미지 업로드: 1개

---

### Phase 3: 구매자 기능 (예정)

**목표**: 상품 조회부터 주문까지

**주요 기능**:
- 상품 조회 API (공개, 검색, 필터링)
- 장바구니 API (추가, 조회, 수량 변경, 삭제)
- 배송지 관리 API (CRUD, 기본 배송지 설정)

---

### Phase 4: 주문 및 결제 (예정)

**목표**: 주문 생성부터 결제까지

**주요 기능**:
- 쿠폰 API (발급, 조회, 사용)
- 주문 API (생성, 조회, 취소)
- 결제 API (요청, 승인, 취소/환불)

---

### Phase 5: 관리자 기능 (예정)

**목표**: 플랫폼 운영 관리

**주요 기능**:
- 회원 관리 (목록, 상태 변경, 권한 관리)
- 판매사 관리 (승인/거절, 정지/해제)
- 상품 관리 (승인/거절, 부적절 상품 삭제)
- 주문 관리 (전체 조회, 상태 변경, 환불/교환)

---

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password**: bcrypt

### Development
- **Testing**: Jest, Supertest (계획)
- **Manual Testing**: curl, Postman
- **Code Quality**: ESLint
- **Deployment**: Railway (계획)

---

## 📁 프로젝트 구조

```
fleecat-backend/
├── src/
│   ├── config/           # 설정 파일 (DB 연결 등)
│   ├── controllers/      # HTTP 요청/응답 처리
│   ├── services/         # 비즈니스 로직
│   ├── repositories/     # 데이터 접근 계층
│   ├── middlewares/      # 인증, 검증, 에러 처리
│   ├── routes/           # API 엔드포인트 정의
│   └── utils/            # 유틸리티 (JWT, 에러, 응답)
├── prisma/
│   ├── schema.prisma     # 데이터베이스 스키마
│   └── migrations/       # 마이그레이션 파일
├── md/                   # 문서
│   ├── step1/            # Phase 1 작업 기록 (13개 문서)
│   ├── step2/            # Phase 2 계획 (1개 문서)
│   ├── db_*.md           # 데이터베이스 가이드 (5개)
│   └── *.md              # 프로젝트 가이드 (6개)
├── tests/                # 테스트 파일 (계획)
├── .env                  # 환경 변수 (프로덕션)
├── .env.test             # 환경 변수 (테스트)
├── jest.config.js        # Jest 설정
├── package.json          # 의존성 및 스크립트
└── README.md             # 프로젝트 개요 (본 문서)
```

---

## 🚀 시작하기

### 필수 요구사항

- Node.js v18 이상
- PostgreSQL (또는 Supabase 계정)
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd fleecat-backend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (DATABASE_URL, JWT_SECRET 등)

# 4. 데이터베이스 마이그레이션
npm run prisma:migrate

# 5. Prisma Client 생성
npm run prisma:generate

# 6. 개발 서버 실행
npm run dev
```

### 주요 스크립트

```bash
# 개발
npm run dev              # nodemon으로 개발 서버 실행
npm start                # 프로덕션 서버 실행

# 데이터베이스
npm run prisma:generate  # Prisma Client 생성
npm run prisma:migrate   # 마이그레이션 실행
npm run prisma:studio    # Prisma Studio (DB GUI) 실행

# 코드 품질
npm run lint             # ESLint 실행
npm run lint:fix         # ESLint 자동 수정

# 테스트 (계획)
npm test                 # 전체 테스트 실행
npm run test:watch       # 테스트 감시 모드
```

---

## 📖 API 문서

### Phase 1 API (구현 완료)

**Base URL**: `http://localhost:3000/api/v1`

#### 인증 (Auth)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/auth/register` | 회원가입 | - |
| POST | `/auth/login` | 로그인 | - |
| PUT | `/auth/change-password` | 비밀번호 변경 | Required |

#### 회원 정보 (Member)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/members/me` | 내 정보 조회 | Required |
| PUT | `/members/me` | 내 정보 수정 | Required |

### Phase 2 API (계획)

#### 판매사 (Tenant)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/tenants` | 판매사 등록 신청 | Required |
| GET | `/tenants/me` | 내 판매사 목록 | Required |
| GET | `/tenants/:id` | 판매사 상세 조회 | - |
| PUT | `/tenants/:id` | 판매사 정보 수정 | Owner |
| PUT | `/tenants/:id/approve` | 판매사 승인 | Admin |

#### 카테고리 (Category)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/categories` | 카테고리 목록 (계층형) | - |
| GET | `/categories/:id` | 카테고리 상세 | - |
| POST | `/categories` | 카테고리 생성 | Admin |
| PUT | `/categories/:id` | 카테고리 수정 | Admin |
| DELETE | `/categories/:id` | 카테고리 삭제 | Admin |

#### 상품 (Product)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/products` | 상품 목록 (필터, 정렬, 페이징) | - |
| GET | `/products/:id` | 상품 상세 조회 | - |
| POST | `/products` | 상품 등록 | Seller |
| PUT | `/products/:id` | 상품 수정 | Owner |
| DELETE | `/products/:id` | 상품 삭제 | Owner |
| POST | `/products/:id/images` | 상품 이미지 업로드 | Owner |

---

## 🔐 인증 및 권한

### JWT 토큰 사용법

**로그인 응답 예시**:
```json
{
  "success": true,
  "data": {
    "member": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**API 요청 시**:
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/v1/members/me
```

### 권한 레벨

| 역할 | 권한 |
|------|------|
| **Guest** | 상품 조회, 카테고리 조회 |
| **Buyer** | Guest + 장바구니, 주문, 결제 |
| **Seller** | Buyer + 상품 등록/수정, 주문 처리 |
| **Admin** | 전체 권한 + 판매사 승인, 카테고리 관리 |

---

## 📊 데이터베이스 ERD

### 핵심 관계

```
Company (1) ──────── (N) Member
                      │
                      ├─ (1:1) MemberPermission
                      ├─ (1:N) MemberAddress
                      ├─ (1:N) MemberTransaction
                      ├─ (1:N) Order
                      ├─ (1:N) ShoppingCart
                      └─ (N:N) ──┐
                                 │
                          TenantMember
                                 │
                                 ├─ (N:1) Tenant ── (1:1) TenantDetail
                                 └─ (1:N) Product ── (1:N) ProductImg
                                            │
                                            └─ (N:1) Category (계층형)

Order (1) ──── (1) Payment
  │
  └─ (N:1) Coupon
```

### 주요 테이블

**총 15개 테이블**:
1. 회원 & 기업 (5개): `member`, `company`, `member_address`, `member_permissions`, `member_transactions`
2. 판매사 (3개): `tenant`, `tenant_detail`, `tenant_member`
3. 카테고리 (1개): `category`
4. 상품 (2개): `product`, `product_img`
5. 쿠폰 (1개): `coupon`
6. 장바구니 (1개): `shopping_cart`
7. 주문 & 결제 (2개): `order`, `payment`

---

## 🧪 테스트 전략

### Phase 1 테스트 결과

**수동 테스트 (Manual Testing)**:
- 도구: curl, Postman
- 테스트 케이스: 20개 (완료: 12개, 통과율: 100%)
- 버그 발견: 5개 Critical (모두 수정 완료)

**테스트 문서**:
- `md/step1/test/change-password.md` - 비밀번호 변경 (4/7 케이스)
- `md/step1/test/member-get-me.md` - 내 정보 조회 (4/4 케이스)
- `md/step1/test/member-update-me.md` - 내 정보 수정 (4/5 케이스)

### 향후 계획

**자동화 테스트** (Phase 2+):
- Jest 단위 테스트 (Repository, Service 계층)
- Supertest 통합 테스트 (API 엔드포인트)
- 커버리지 목표: 80% 이상

---

## 📚 문서

### 프로젝트 가이드
- `md/01_README.md` - 프로젝트 구조 및 개요
- `md/02_CODING_STANDARDS.md` - 코딩 표준 및 네이밍 규칙
- `md/03_ARCHITECTURE.md` - 아키텍처 및 디자인 패턴
- `md/04_API_DEVELOPMENT.md` - API 개발 가이드
- `md/05_TESTING_DEPLOYMENT.md` - 테스트 및 배포
- `md/06_COLLABORATION.md` - 협업 가이드

### 데이터베이스 가이드
- `md/db_00_INDEX.md` - 데이터베이스 문서 목차
- `md/db_01_VARIABLE_REFERENCE.md` - 변수 빠른 참조
- `md/db_02_NAMING_DATATYPES.md` - 네이밍 규칙 & 데이터 타입
- `md/db_03_RELATIONSHIPS.md` - 변수 관계도 & FK

### Phase별 작업 기록
- `md/step1/00_INDEX.md` - Phase 1 작업 기록 (13개 Step)
- `md/step2/00_INDEX.md` - Phase 2 계획 (14개 Step)

### API 개발 계획
- `md/api_develop_plan.md` - 전체 API 개발 로드맵

---

## 🔧 환경 변수

**필수 환경 변수** (`.env`):

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database

# Supabase (선택)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
PORT=3000
NODE_ENV=development
```

---

## 📈 성과 및 통계

### Phase 1 (완료)

**개발 기간**: 2일 (2025.10.01 ~ 2025.10.02)

**작업량**:
- 코드 파일: 13개 (Repository 2개, Service 2개, Controller 2개, Routes 2개, Middleware 3개, Utils 2개)
- 문서: 16개 (Step 기록 13개, 테스트 결과 3개)
- API 엔드포인트: 5개
- 테스트 케이스: 12개 (통과율 100%)

**버그 발견 및 수정**: 5개 Critical

**주요 학습**:
- Prisma ORM 관계 필드명 정확도 중요성
- BigInt 직렬화 처리 방법
- JWT 토큰 기반 인증 구현
- Repository 패턴 적용

---

## 🤝 기여 가이드

### 코딩 표준

- **네이밍**: camelCase (변수, 함수), PascalCase (클래스, 컴포넌트)
- **파일명**: kebab-case (`auth.controller.js`, `member.repository.js`)
- **커밋 메시지**: `type: subject` 형식 (예: `feat: Add product API`)
- **주석**: JSDoc 형식 사용

### 브랜치 전략

```
main (프로덕션)
  └── develop (개발)
       ├── feature/phase-1 (완료)
       ├── feature/phase-2 (예정)
       └── feature/phase-3 (예정)
```

---

## 📞 문의 및 지원

**프로젝트 관리**: Backend Team
**문서 작성일**: 2025년 10월 2일
**최종 업데이트**: 2025년 10월 2일

---

## 📜 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 개발되었습니다.

---

**현재 상태**: Phase 1 완료 ✅, Phase 2 계획 수립 완료 📋
**다음 단계**: Phase 2 구현 시작 (Tenant & Product 관리)
