# 플리캣(Fleecat) 시스템 아키텍처

## 개요

플리캣은 풀스택 전자상거래 플랫폼으로, React 기반 프론트엔드와 Node.js/Express 기반 백엔드, 그리고 Supabase를 데이터베이스 및 인증 서비스로 사용하는 3티어 아키텍처를 채택하고 있습니다.

## 전체 시스템 구조

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   Backend       │◄──►│   Supabase      │
│   (React/Vite)  │    │   (Node.js)     │    │   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       Port:            Port: 8000              (Cloud Service)
       5173 (dev)
```

## 백엔드 아키텍처 (be-skeleton)

### 기술 스택
- **런타임**: Node.js (ES Modules)
- **프레임워크**: Express.js
- **데이터베이스**: Supabase (PostgreSQL)
- **개발 도구**: Nodemon
- **미들웨어**: CORS, Express JSON Parser

### 디렉토리 구조
```
be-skeleton/
├── src/
│   ├── server.js              # 서버 진입점
│   ├── app.js                 # Express 앱 설정
│   ├── controllers/           # 비즈니스 로직
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   └── products.controller.js
│   ├── routes/                # API 라우팅
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   └── products.routes.js
│   ├── middlewares/           # 공통 미들웨어
│   │   └── error.js
│   └── data/                  # 임시 데이터
│       └── products.js
├── package.json
└── .env                       # 환경변수
```

### API 엔드포인트

#### 인증 API (`/auth`)
- `POST /auth/signup` - 사용자 회원가입
- `POST /auth/login` - 사용자 로그인

#### 상품 API (`/api/products`)
- `GET /api/products` - 전체 상품 목록 조회
- `GET /api/products/:id` - 특정 상품 상세 조회

#### 장바구니 API (`/api/cart`)
- 장바구니 관련 기능 (개발 예정)

#### 헬스체크
- `GET /health` - 서버 상태 확인

### 아키텍처 패턴
- **MVC 패턴**: Controllers, Routes, Models (Data) 분리
- **미들웨어 체인**: CORS → JSON Parser → Routes → Error Handler
- **에러 핸들링**: 중앙화된 에러 처리 (404, 500)

## 프론트엔드 아키텍처 (fe-skeleton)

### 기술 스택
- **UI 라이브러리**: React 19
- **빌드 도구**: Vite
- **라우팅**: React Router DOM v7
- **상태관리**: React Context API
- **데이터베이스 클라이언트**: Supabase JS SDK
- **UI 피드백**: React Hot Toast
- **코드 품질**: ESLint

### 디렉토리 구조
```
fe-skeleton/
├── src/
│   ├── App.jsx                # 루트 컴포넌트
│   ├── main.jsx              # 앱 진입점
│   ├── components/           # 재사용 컴포넌트
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   └── index.js
│   │   ├── BodyHeader/
│   │   │   ├── BodyHeader.jsx
│   │   │   ├── BodyHeader.css
│   │   │   └── index.js
│   │   ├── LoadingState/
│   │   │   └── LoadingState.css
│   │   ├── ErrorState/
│   │   │   └── ErrorState.css
│   │   ├── ProtectedRoute.jsx
│   │   └── EventBlock.jsx
│   ├── contexts/             # React Context
│   │   └── AuthContext.jsx
│   ├── layouts/              # 레이아웃 컴포넌트
│   │   └── Layout.jsx
│   ├── pages/                # 페이지 컴포넌트 (권장 패턴 구조)
│   │   ├── Home/
│   │   │   ├── Home.jsx        # 실제 컴포넌트 코드
│   │   │   ├── Home.css
│   │   │   └── index.js        # export만 담당
│   │   ├── Products/
│   │   │   ├── Products.jsx    # 실제 컴포넌트 코드
│   │   │   ├── Products.css    # ProductGrid + ProductCard 스타일
│   │   │   └── index.js        # export만 담당
│   │   ├── ProductDetail/
│   │   │   ├── ProductDetail.jsx # 실제 컴포넌트 코드
│   │   │   └── index.js        # export만 담당
│   │   ├── Cart/
│   │   │   ├── Cart.jsx        # 실제 컴포넌트 코드
│   │   │   └── index.js        # export만 담당
│   │   ├── Login/
│   │   │   ├── Login.jsx       # 실제 컴포넌트 코드
│   │   │   └── index.js        # export만 담당
│   │   ├── Signup/
│   │   │   ├── Signup.jsx      # 실제 컴포넌트 코드
│   │   │   └── index.js        # export만 담당
│   │   └── NotFound/
│   │       ├── NotFound.jsx    # 실제 컴포넌트 코드
│   │       └── index.js        # export만 담당
│   ├── lib/                  # 유틸리티 라이브러리
│   │   ├── supabaseClient.js
│   │   ├── api.js
│   │   └── toast.jsx
│   ├── styles/               # 전역 스타일
│   │   ├── variables.css      # 디자인 시스템 변수
│   │   ├── Layout.css         # 레이아웃 시스템
│   │   └── Form.css          # 공통 폼 스타일
│   ├── utils/                # 헬퍼 함수
│   │   └── cart.js
│   └── routes/               # 라우팅 설정
│       └── index.jsx
├── package.json
├── vite.config.js
└── eslint.config.js
```

### 라우팅 구조
```
/                    # 홈페이지
├── /products        # 상품 목록
├── /products/:id    # 상품 상세
├── /cart           # 장바구니
├── /account        # 마이페이지 (인증 필요)
├── /login          # 로그인
├── /signup         # 회원가입
└── /*              # 404 페이지
```

### 아키텍처 패턴
- **컴포넌트 기반 아키텍처**: 페이지, 레이아웃, 재사용 컴포넌트 분리
- **권장 파일 구조**: 컴포넌트명.jsx + index.js 패턴으로 명확한 식별
- **컴포넌트 응집도**: 각 컴포넌트와 관련 스타일을 동일 폴더에 위치
- **Context API 패턴**: 전역 인증 상태 관리
- **Protected Routes**: 인증이 필요한 페이지 보호
- **API 레이어**: 백엔드 API 호출을 위한 추상화 계층
- **로컬 스토리지**: 장바구니 데이터 클라이언트 측 저장
- **디자인 시스템**: 전역 CSS 변수와 공통 스타일 분리
- **Export 패턴**: index.js를 통한 깔끔한 모듈 export 관리

### 상태 관리
- **전역 상태**: AuthContext (인증 정보)
- **로컬 상태**: useState hooks (컴포넌트별 상태)
- **클라이언트 저장소**: localStorage (장바구니 데이터)
- **서버 상태**: API 호출을 통한 데이터 fetching

## 데이터베이스 (Supabase)

### 주요 기능
- **PostgreSQL 데이터베이스**: 관계형 데이터 저장
- **인증 서비스**: 사용자 회원가입/로그인 관리
- **실시간 구독**: 데이터 변경 실시간 반영
- **파일 스토리지**: 이미지 및 파일 저장

### 인증 설정
- **세션 관리**: 브라우저 로컬 스토리지 (IndexedDB)
- **토큰 자동 갱신**: autoRefreshToken 활성화
- **세션 유지**: persistSession 활성화

## 통신 및 데이터 플로우

### 클라이언트-서버 통신
```
Frontend (React) ←→ Backend API (Express) ←→ Supabase Database
```

### API 통신 패턴
1. **REST API**: HTTP 기반 RESTful 서비스
2. **JSON 데이터 교환**: 모든 API 통신은 JSON 형식
3. **에러 핸들링**: 표준화된 에러 응답 및 토스트 알림
4. **로딩 상태 관리**: 비동기 작업에 대한 사용자 피드백

### 인증 플로우
```
1. 사용자 로그인 → Supabase Auth
2. 세션 생성 → AuthContext 저장
3. 보호된 라우트 접근 시 → ProtectedRoute 검증
4. API 요청 시 → 인증 토큰 포함
```

## 개발 및 배포 환경

### 개발 서버
- **프론트엔드**: Vite dev server (Port 5173)
- **백엔드**: Nodemon (Port 8000)
- **핫 리로딩**: 코드 변경 시 자동 재시작

### 환경 변수 관리
- **백엔드**: `.env` 파일 (Supabase URL, Service Key)
- **프론트엔드**: `.env` 파일 (Vite_ prefix, Supabase 공개 키)

### 빌드 및 배포
- **프론트엔드**: `vite build` → 정적 파일 생성
- **백엔드**: `node src/server.js` → 프로덕션 실행

## 보안 고려사항

### 클라이언트 보안
- **환경변수**: 민감한 키는 서버 측에서만 사용
- **CORS 설정**: 개발 환경에서 로컬호스트 허용
- **인증 토큰**: Supabase에서 자동 관리

### 서버 보안
- **미들웨어**: CORS, JSON 파싱 보안
- **에러 핸들링**: 민감한 정보 노출 방지
- **환경변수**: 데이터베이스 키 보호

## 확장 가능성

### 현재 구현된 기능
- 기본적인 CRUD API
- 사용자 인증 (기본 구조)
- 상품 관리
- 장바구니 (클라이언트 측)
- 반응형 UI

### 향후 확장 계획
- 실제 Supabase 데이터베이스 연동
- JWT 토큰 기반 인증
- 결제 시스템 통합
- 관리자 패널
- 실시간 알림
- 이미지 업로드 및 최적화
- 검색 및 필터링 기능
- 성능 최적화 (캐싱, 페이지네이션)

## 결론

현재 플리캣 시스템은 모던 웹 개발 스택을 기반으로 한 확장 가능한 아키텍처를 채택하고 있습니다. React와 Node.js의 조합으로 개발 생산성을 높였으며, Supabase를 통해 백엔드 인프라 복잡성을 줄였습니다. 각 계층이 명확히 분리되어 유지보수가 용이하고, 추가 기능 개발에 적합한 구조를 갖추고 있습니다.