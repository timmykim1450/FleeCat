# Phase 2: 판매자 기능 구축 - 작업 기록

> **목표**: 판매사 등록부터 상품 등록까지 멀티테넌트 핵심 기능 구축
> **기간**: 2025년 10월 X일 ~
> **상태**: 📋 계획 수립 완료

---

## 📚 문서 목록

### 🔄 진행 예정

#### Step 2-1: Tenant Repository 생성
- **파일**: `src/repositories/tenant.repository.js`
- **내용**: Tenant 테이블 데이터 접근 계층
- **주요 함수**:
  - `findById(tenantId)` - ID로 판매사 조회
  - `findByName(tenantName)` - 이름으로 판매사 조회
  - `create(tenantData)` - 판매사 생성
  - `update(tenantId, updateData)` - 판매사 수정
  - `updateStatus(tenantId, status)` - 상태 변경 (승인/거절)
  - `findAll(options)` - 판매사 목록 조회 (페이징, 필터링)
  - `existsByName(tenantName)` - 이름 중복 확인
- **예정일**: TBD

#### Step 2-2: TenantDetail Repository 생성
- **파일**: `src/repositories/tenantDetail.repository.js`
- **내용**: TenantDetail 테이블 데이터 접근 계층
- **주요 함수**:
  - `findByTenantId(tenantId)` - 판매사 상세 조회
  - `create(tenantDetailData)` - 상세 정보 생성
  - `update(tenantId, updateData)` - 상세 정보 수정
- **예정일**: TBD

#### Step 2-3: TenantMember Repository 생성
- **파일**: `src/repositories/tenantMember.repository.js`
- **내용**: TenantMember 테이블 데이터 접근 계층
- **주요 함수**:
  - `findById(tenantMemberId)` - ID로 구성원 조회
  - `findByTenantId(tenantId)` - 판매사별 구성원 목록
  - `findByMemberId(memberId)` - 회원의 소속 판매사 목록
  - `create(tenantMemberData)` - 구성원 가입 신청
  - `updateApprovalStatus(id, status)` - 승인/거절
  - `update(id, updateData)` - 구성원 정보 수정
  - `existsByTenantAndMember(tenantId, memberId)` - 중복 가입 방지
- **예정일**: TBD

#### Step 2-4: Category Repository 생성
- **파일**: `src/repositories/category.repository.js`
- **내용**: Category 테이블 데이터 접근 계층 (계층형 구조)
- **주요 함수**:
  - `findById(categoryId)` - 카테고리 조회
  - `findByParentId(parentId)` - 자식 카테고리 조회
  - `findAll()` - 전체 카테고리 조회 (계층형)
  - `create(categoryData)` - 카테고리 생성
  - `update(categoryId, updateData)` - 카테고리 수정
  - `deleteById(categoryId)` - 카테고리 삭제
  - `updatePath(categoryId, path)` - 카테고리 경로 갱신
- **예정일**: TBD

#### Step 2-5: Product Repository 생성
- **파일**: `src/repositories/product.repository.js`
- **내용**: Product 테이블 데이터 접근 계층
- **주요 함수**:
  - `findById(productId)` - 상품 조회
  - `findByTenantMemberId(tenantMemberId)` - 판매자별 상품 목록
  - `findByCategoryId(categoryId)` - 카테고리별 상품 목록
  - `findAll(options)` - 전체 상품 목록 (페이징, 필터, 정렬)
  - `create(productData)` - 상품 생성
  - `update(productId, updateData)` - 상품 수정
  - `updateStatus(productId, status)` - 상품 상태 변경
  - `deleteById(productId)` - 상품 삭제
  - `incrementViewCount(productId)` - 조회수 증가
- **예정일**: TBD

#### Step 2-6: ProductImg Repository 생성
- **파일**: `src/repositories/productImg.repository.js`
- **내용**: ProductImg 테이블 데이터 접근 계층
- **주요 함수**:
  - `findByProductId(productId)` - 상품 이미지 목록
  - `create(productImgData)` - 이미지 추가
  - `deleteById(productImgId)` - 이미지 삭제
  - `deleteByProductId(productId)` - 상품의 모든 이미지 삭제
  - `updateSequence(productImgId, sequence)` - 이미지 순서 변경
- **예정일**: TBD

#### Step 2-7: Tenant Service 생성
- **파일**: `src/services/tenant.service.js`
- **내용**: 판매사 등록 및 관리 비즈니스 로직
- **주요 함수**:
  - `createTenant(data)` - 판매사 등록 신청 (이름 중복 확인, 상세 정보 함께 생성)
  - `getMyTenant(memberId)` - 내가 속한 판매사 목록
  - `getTenantById(tenantId)` - 판매사 상세 조회
  - `updateTenant(tenantId, data)` - 판매사 정보 수정
  - `approveTenant(tenantId, adminId)` - 판매사 승인 (관리자)
  - `rejectTenant(tenantId, adminId)` - 판매사 거절 (관리자)
  - `getAllTenants(options)` - 판매사 목록 조회 (관리자)
- **예정일**: TBD

#### Step 2-8: TenantMember Service 생성
- **파일**: `src/services/tenantMember.service.js`
- **내용**: 판매사 구성원 가입 및 관리 비즈니스 로직
- **주요 함수**:
  - `applyToTenant(memberId, tenantId, data)` - 판매사 가입 신청
  - `approveMember(tenantMemberId, approverId)` - 구성원 승인 (공방주)
  - `rejectMember(tenantMemberId, approverId)` - 구성원 거절
  - `getTenantMembers(tenantId)` - 판매사 구성원 목록
  - `getMyTenantMemberships(memberId)` - 내 소속 판매사 목록
  - `updateMember(tenantMemberId, data)` - 구성원 정보 수정
- **예정일**: TBD

#### Step 2-9: Category Service 생성
- **파일**: `src/services/category.service.js`
- **내용**: 계층형 카테고리 관리 비즈니스 로직
- **주요 함수**:
  - `createCategory(data)` - 카테고리 생성 (경로 자동 계산)
  - `getCategoryTree()` - 계층형 카테고리 트리 조회
  - `getCategoryById(categoryId)` - 카테고리 상세
  - `updateCategory(categoryId, data)` - 카테고리 수정
  - `deleteCategory(categoryId)` - 카테고리 삭제 (자식 카테고리 확인)
- **예정일**: TBD

#### Step 2-10: Product Service 생성
- **파일**: `src/services/product.service.js`
- **내용**: 상품 등록 및 관리 비즈니스 로직
- **주요 함수**:
  - `createProduct(tenantMemberId, data)` - 상품 등록 (권한 확인)
  - `getProductById(productId)` - 상품 상세 조회 (조회수 증가)
  - `getMyProducts(tenantMemberId)` - 내 상품 목록
  - `getAllProducts(options)` - 전체 상품 목록 (필터링, 정렬, 페이징)
  - `updateProduct(productId, memberId, data)` - 상품 수정 (본인 확인)
  - `deleteProduct(productId, memberId)` - 상품 삭제
  - `uploadProductImages(productId, imageUrls)` - 상품 이미지 업로드
- **예정일**: TBD

#### Step 2-11: Controllers 생성
- **파일**:
  - `src/controllers/tenant.controller.js`
  - `src/controllers/tenantMember.controller.js`
  - `src/controllers/category.controller.js`
  - `src/controllers/product.controller.js`
- **내용**: 판매자 기능 HTTP 요청/응답 처리
- **주요 함수**:
  - Tenant Controller: register, getMyTenants, getTenantById, updateTenant, approveTenant, rejectTenant
  - TenantMember Controller: applyToTenant, getTenantMembers, approveMember, rejectMember, getMyMemberships
  - Category Controller: getCategories, getCategoryById, createCategory, updateCategory, deleteCategory
  - Product Controller: getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadImages
- **예정일**: TBD

#### Step 2-12: Validation Middleware 추가
- **파일**: `src/middlewares/validation.js` (수정)
- **내용**: 판매자 기능 입력 검증 미들웨어
- **추가 함수**:
  - `validateCreateTenant` - 판매사 등록 검증 (이름, 상세 정보)
  - `validateCreateTenantMember` - 구성원 가입 검증 (역할, 계좌 정보)
  - `validateCreateCategory` - 카테고리 생성 검증 (이름, 부모 ID)
  - `validateCreateProduct` - 상품 등록 검증 (이름, 가격, 재고, 카테고리)
  - `validateUpdateProduct` - 상품 수정 검증
- **예정일**: TBD

#### Step 2-13: Routes 생성 및 통합
- **파일**:
  - `src/routes/tenant.routes.js`
  - `src/routes/category.routes.js`
  - `src/routes/product.routes.js`
  - `src/routes/index.js` (수정)
- **내용**: 판매자 기능 API 엔드포인트
- **라우트**:
  - POST `/api/v1/tenants` - 판매사 등록 신청 (Private)
  - GET `/api/v1/tenants/me` - 내 판매사 목록 (Private)
  - GET `/api/v1/tenants/:id` - 판매사 상세 조회 (Public)
  - PUT `/api/v1/tenants/:id` - 판매사 정보 수정 (Private, Owner)
  - PUT `/api/v1/tenants/:id/approve` - 판매사 승인 (Admin)
  - POST `/api/v1/tenants/:id/members` - 구성원 가입 신청 (Private)
  - GET `/api/v1/tenants/:id/members` - 구성원 목록 (Public)
  - PUT `/api/v1/tenant-members/:id/approve` - 구성원 승인 (Owner)
  - GET `/api/v1/categories` - 카테고리 목록 (Public)
  - POST `/api/v1/categories` - 카테고리 생성 (Admin)
  - GET `/api/v1/products` - 상품 목록 (Public)
  - POST `/api/v1/products` - 상품 등록 (Seller)
  - GET `/api/v1/products/:id` - 상품 상세 (Public)
  - PUT `/api/v1/products/:id` - 상품 수정 (Owner)
  - DELETE `/api/v1/products/:id` - 상품 삭제 (Owner)
- **예정일**: TBD

#### Step 2-14: 테스트 및 문서화
- **문서**: `md/step2/test/` 폴더
- **내용**: 판매자 기능 API 수동 테스트 및 결과 문서화
- **테스트 대상**:
  - 판매사 등록 및 승인 프로세스
  - 구성원 가입 및 승인 프로세스
  - 카테고리 CRUD
  - 상품 CRUD 및 이미지 업로드
- **예정일**: TBD

---

## 🎯 Phase 2 완료 기준

### API 엔드포인트

**Tenant (판매사) 관리**
- [ ] POST `/api/v1/tenants` - 판매사 등록 신청
- [ ] GET `/api/v1/tenants/me` - 내 판매사 목록
- [ ] GET `/api/v1/tenants/:id` - 판매사 상세 조회
- [ ] PUT `/api/v1/tenants/:id` - 판매사 정보 수정
- [ ] PUT `/api/v1/tenants/:id/approve` - 판매사 승인 (관리자)

**TenantMember (구성원) 관리**
- [ ] POST `/api/v1/tenants/:id/members` - 구성원 가입 신청
- [ ] GET `/api/v1/tenants/:id/members` - 구성원 목록 조회
- [ ] PUT `/api/v1/tenant-members/:id/approve` - 구성원 승인
- [ ] GET `/api/v1/members/me/tenants` - 내 소속 판매사 목록

**Category (카테고리) 관리**
- [ ] GET `/api/v1/categories` - 카테고리 목록 조회 (계층형)
- [ ] GET `/api/v1/categories/:id` - 카테고리 상세 조회
- [ ] POST `/api/v1/categories` - 카테고리 생성 (관리자)
- [ ] PUT `/api/v1/categories/:id` - 카테고리 수정 (관리자)
- [ ] DELETE `/api/v1/categories/:id` - 카테고리 삭제 (관리자)

**Product (상품) 관리**
- [ ] GET `/api/v1/products` - 상품 목록 조회 (필터링, 정렬, 페이징)
- [ ] GET `/api/v1/products/:id` - 상품 상세 조회
- [ ] POST `/api/v1/products` - 상품 등록 (판매자)
- [ ] PUT `/api/v1/products/:id` - 상품 수정 (본인)
- [ ] DELETE `/api/v1/products/:id` - 상품 삭제 (본인)
- [ ] POST `/api/v1/products/:id/images` - 상품 이미지 업로드

### 핵심 기능

**멀티테넌시**
- [ ] 한 회원이 여러 판매사에 소속 가능
- [ ] TenantMember를 통한 권한 분리
- [ ] Product는 TenantMember에 속함 (Tenant 아님)

**승인 프로세스**
- [ ] 판매사 등록 승인 (관리자)
- [ ] 구성원 가입 승인 (판매사 owner)

**계층형 카테고리**
- [ ] 부모-자식 관계 (자기 참조)
- [ ] category_path 자동 생성 및 갱신
- [ ] 계층형 트리 구조 조회

**권한 관리**
- [ ] 판매사 등록: 로그인 회원
- [ ] 구성원 승인: 판매사 owner
- [ ] 상품 등록: 승인된 TenantMember
- [ ] 카테고리 관리: 관리자

### 테스트
- [ ] 판매사 등록 및 승인 프로세스 테스트
- [ ] 구성원 가입 및 승인 프로세스 테스트
- [ ] 카테고리 CRUD 테스트
- [ ] 상품 CRUD 및 이미지 업로드 테스트
- [ ] 멀티테넌시 로직 검증

### 문서
- [ ] 각 Step별 작업 기록 작성 (14개)
- [ ] 테스트 결과 문서 작성
- [ ] Phase 2 완료 보고서

---

## 📊 진행률

```
전체: 14개 작업
완료: 0개 (0%)
진행 중: 0개
예정: 14개
```

---

## 🔑 핵심 개념

### 1. 멀티테넌시 (Multi-Tenancy)

**개념**: 한 플랫폼에 여러 판매사(Tenant)가 존재하고, 각 판매사는 독립적으로 운영

**구조**:
```
Member (회원)
  ↓ N:N
TenantMember (판매사 구성원)
  ↓ 1:N
Product (상품)
```

**특징**:
- 한 회원이 여러 판매사에 소속 가능
- 상품은 판매사가 아닌 TenantMember에 속함
- 판매사별 데이터 격리 (tenant_id로 필터링)

**예시**:
```javascript
// 홍길동은 "A공방"과 "B공방" 모두에 소속
Member: { member_id: 1, member_name: "홍길동" }

TenantMember: [
  { tenant_member_id: 10, tenant_id: 1, member_id: 1 }, // A공방
  { tenant_member_id: 20, tenant_id: 2, member_id: 1 }  // B공방
]

Product: [
  { product_id: 100, tenant_member_id: 10 }, // A공방 상품
  { product_id: 200, tenant_member_id: 20 }  // B공방 상품
]
```

---

### 2. 승인 프로세스

**판매사 승인** (관리자):
```
pending → approved (승인) / rejected (거절)
```

**구성원 승인** (판매사 owner):
```
pending → approved (승인) / rejected (거절)
```

**프로세스**:
1. 회원이 판매사 등록 신청 → `tenant_status: 'pending'`
2. 관리자가 승인 → `tenant_status: 'approved'`, `tenant_approved_at` 설정
3. 회원이 판매사에 구성원 가입 신청 → `tenant_member_approval_status: 'pending'`
4. 판매사 owner가 승인 → `tenant_member_approval_status: 'approved'`
5. 승인된 구성원만 상품 등록 가능

---

### 3. 계층형 카테고리

**구조**:
```
대분류 (depth: 1, parent_category_id: NULL)
  ├─ 중분류 (depth: 2, parent_category_id: 1)
  │   ├─ 소분류 (depth: 3, parent_category_id: 5)
  │   └─ 소분류 (depth: 3, parent_category_id: 5)
  └─ 중분류 (depth: 2, parent_category_id: 1)
```

**category_path 예시**:
- 대분류 (ID: 1): `category_path = "1"`
- 중분류 (ID: 5): `category_path = "1/5"`
- 소분류 (ID: 12): `category_path = "1/5/12"`

**계층형 조회**:
```javascript
// 재귀적으로 자식 카테고리 포함
{
  category_id: 1,
  category_name: "수공예품",
  child_categories: [
    {
      category_id: 5,
      category_name: "도자기",
      child_categories: [
        { category_id: 12, category_name: "찻잔" },
        { category_id: 13, category_name: "접시" }
      ]
    }
  ]
}
```

---

### 4. 권한 체크

| 기능 | 필요 권한 | 미들웨어 | 확인 방법 |
|------|----------|----------|----------|
| 판매사 등록 | 로그인 회원 | `authenticate` | JWT 토큰 |
| 판매사 승인 | 관리자 | `authorize('admin')` | `req.user.role === 'admin'` |
| 구성원 승인 | 판매사 owner | Custom | `tenant_member_role === 'owner'` |
| 상품 등록 | 승인된 TenantMember | Custom | `tenant_member_approval_status === 'approved'` |
| 카테고리 관리 | 관리자 | `authorize('admin')` | `req.user.role === 'admin'` |

**Custom 권한 체크 예시**:
```javascript
// 판매사 owner인지 확인
async function checkTenantOwner(req, res, next) {
  const tenantId = req.params.id;
  const memberId = req.user.member_id;

  const tenantMember = await tenantMemberRepository.findByTenantIdAndMemberId(tenantId, memberId);

  if (!tenantMember || tenantMember.tenant_member_role !== 'owner') {
    return next(new ForbiddenError('Only tenant owner can perform this action'));
  }

  next();
}
```

---

## 🔗 관련 문서

### 프로젝트 가이드
- [프로젝트 개요](../01_README.md)
- [코딩 표준](../02_CODING_STANDARDS.md)
- [API 개발 가이드](../04_API_DEVELOPMENT.md)

### 데이터베이스 가이드
- [변수 빠른 참조](../db_01_VARIABLE_REFERENCE.md)
- [네이밍 규칙 & 데이터 타입](../db_02_NAMING_DATATYPES.md)
- [변수 관계도 & FK](../db_03_RELATIONSHIPS.md)

### 개발 계획
- [API 개발 계획서](../api_develop_plan.md)

### 이전 Phase
- [Phase 1: 기초 인프라 구축](../step1/00_INDEX.md)

---

**최종 업데이트**: 2025년 10월 2일
**작성자**: Backend Team
**상태**: 📋 **계획 수립 완료**
