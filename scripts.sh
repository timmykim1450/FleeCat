#!/bin/bash

# Fleecat Backend 프로젝트 초기 설정 스크립트
# 사용법: bash setup.sh

echo "🚀 Fleecat 백엔드 프로젝트 초기 설정을 시작합니다..."

# 프로젝트 루트 디렉토리 이름
PROJECT_NAME="fleecat-backend"

# 프로젝트 폴더가 이미 존재하는지 확인
if [ -d "$PROJECT_NAME" ]; then
  echo "⚠️  프로젝트 폴더가 이미 존재합니다. 덮어쓰시겠습니까? (y/n)"
  read -r answer
  if [ "$answer" != "y" ]; then
    echo "❌ 설정을 취소합니다."
    exit 1
  fi
  rm -rf "$PROJECT_NAME"
fi

# 프로젝트 루트 생성
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "📁 폴더 구조 생성 중..."

# 주요 디렉토리 생성
mkdir -p prisma/migrations
mkdir -p src/config
mkdir -p src/middlewares
mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/services
mkdir -p src/repositories
mkdir -p src/utils
mkdir -p src/types
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
mkdir -p docs/api
mkdir -p docs/architecture
mkdir -p docs/database
mkdir -p scripts
mkdir -p logs

echo "📄 기본 파일 생성 중..."

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.development
.env.production
.env.test

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/

# Prisma
prisma/.env

# Test
coverage/
.nyc_output/
EOF

# .env.example
cat > .env.example << 'EOF'
# Server
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://bzdrmshqarfgwkqrzgix.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZHJtc2hxYXJmZ3drcXJ6Z2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTM1ODYsImV4cCI6MjA3NDc2OTU4Nn0.9VcBc59pCU0VAV97xfccApo_-uaMxrEgoAsydKMRcac
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZHJtc2hxYXJmZ3drcXJ6Z2l4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE5MzU4NiwiZXhwIjoyMDc0NzY5NTg2fQ.1ryqcvPw9TyKFVe6vwYbH2-DSTZuRDpNaxIpya1ESIc

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:fleecat@5857@db.xxxxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF

# .env (실제 설정 파일)
cat > .env << 'EOF'
# Server
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://bzdrmshqarfgwkqrzgix.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZHJtc2hxYXJmZ3drcXJ6Z2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTM1ODYsImV4cCI6MjA3NDc2OTU4Nn0.9VcBc59pCU0VAV97xfccApo_-uaMxrEgoAsydKMRcac
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Database (Supabase PostgreSQL)
# Supabase Dashboard -> Settings -> Database -> Connection String에서 가져오세요
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.bzdrmshqarfgwkqrzgix.supabase.co:5432/postgres

# JWT
JWT_SECRET=fleecat-super-secret-key-change-in-production-2024
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF

# package.json
cat > package.json << 'EOF'
{
  "name": "fleecat-backend",
  "version": "1.0.0",
  "description": "Fleecat Multi-tenant E-commerce Backend",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "node prisma/seed.js"
  },
  "keywords": ["ecommerce", "multi-tenant", "express", "prisma"],
  "author": "Fleecat Team",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "@supabase/supabase-js": "^2.38.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "prisma": "^5.7.0",
    "supertest": "^6.3.3"
  }
}
EOF

# README.md
cat > README.md << 'EOF'
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
EOF

# .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'off'
  }
};
EOF

# .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
EOF

# prisma/schema.prisma (기본 템플릿)
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 여기에 테이블 스키마를 추가하세요
EOF

# src/app.js
cat > src/app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// 로깅
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fleecat API is running' });
});

// API 라우트
app.use('/api/v1', routes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// 에러 핸들러
app.use(errorHandler);

module.exports = app;
EOF

# src/server.js
cat > src/server.js << 'EOF'
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
EOF

# src/routes/index.js
cat > src/routes/index.js << 'EOF'
const express = require('express');
const router = express.Router();

// 라우터들을 여기에 추가
// const authRoutes = require('./auth.routes');
// const productRoutes = require('./product.routes');

// router.use('/auth', authRoutes);
// router.use('/products', productRoutes);

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fleecat API v1',
    version: '1.0.0'
  });
});

module.exports = router;
EOF

# src/config/database.js
cat > src/config/database.js << 'EOF'
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

module.exports = prisma;
EOF

# src/config/supabase.js
cat > src/config/supabase.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
EOF

# src/config/constants.js
cat > src/config/constants.js << 'EOF'
module.exports = {
  // 서버 설정
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // 파일 업로드
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};
EOF

# src/middlewares/errorHandler.js
cat > src/middlewares/errorHandler.js << 'EOF'
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
EOF

# src/utils/response.js
cat > src/utils/response.js << 'EOF'
/**
 * 성공 응답
 */
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * 에러 응답
 */
function errorResponse(res, message, statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse
};
EOF

# src/utils/errors.js
cat > src/utils/errors.js << 'EOF'
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
};
EOF

# railway.json (Railway 설정)
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# .dockerignore (Railway/Docker 배포용)
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
.idea
EOF

echo "✅ 파일 생성 완료!"
echo ""
echo "📦 다음 단계:"
echo "1. cd $PROJECT_NAME"
echo "2. npm install"
echo "3. .env 파일 생성 및 설정"
echo "4. npm run dev"
echo ""
echo "🎉 프로젝트 초기 설정이 완료되었습니다!"