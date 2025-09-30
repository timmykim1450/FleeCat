# Fleecat Backend

멀티테넌트 쇼핑몰 플랫폼 백엔드 API

## 기술 스택

- Node.js 20.x
- Express.js 4.x
- Prisma 5.x (ORM)
- Supabase (PostgreSQL, Auth, Storage)
- Railway (Deployment)

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
# .env 파일을 열어 실제 값으로 수정
```

### 3. Prisma 설정
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. 개발 서버 실행
```bash
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

## API 문서

API 문서는 `/docs/api` 폴더를 참고하세요.

## 프로젝트 구조

```
fleecat-backend/
├── prisma/              # Prisma 스키마 및 마이그레이션
├── src/                 # 소스 코드
│   ├── config/         # 설정 파일
│   ├── middlewares/    # 미들웨어
│   ├── routes/         # 라우터
│   ├── controllers/    # 컨트롤러
│   ├── services/       # 비즈니스 로직
│   ├── repositories/   # 데이터 접근 계층
│   └── utils/          # 유틸리티
├── tests/              # 테스트
└── docs/               # 문서
```

## 배포

Railway에 배포됩니다.

```bash
# Railway CLI로 배포
railway up
```

## 라이선스

ISC
