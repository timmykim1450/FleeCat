# Task 7: Settings 페이지

**담당:** Frontend Team
**예상 소요:** 0.5일 (Day 7)
**우선순위:** 🟡 Medium
**의존성:** Task 1 (인프라), Task 2 (공통 컴포넌트)

---

## 📋 작업 개요

계정 설정 페이지를 구현합니다. 비밀번호 변경과 회원 탈퇴는 UI만 제공하고 Mock 처리합니다.

### 목표
- ✅ 비밀번호 변경 UI (Mock 처리)
- ✅ 회원 탈퇴 UI 및 사유 선택
- ✅ 안내 모달 구현
- ✅ 탈퇴 확인 플로우

---

## 🎯 상세 작업 항목

### 7.1 비밀번호 변경

**파일 구조:**
```
src/pages/Settings/
├── PasswordChange/
│   ├── PasswordChange.jsx
│   └── PasswordChange.css
```

**주요 기능:**
- 현재 비밀번호, 새 비밀번호, 비밀번호 확인 입력
- Zod 유효성 검증 (8자 이상, 영문+숫자+특수문자)
- 제출 시 안내 모달 표시 ("실제 백엔드 연동 후 사용 가능합니다")

### 7.2 회원 탈퇴

**파일 구조:**
```
src/pages/Settings/
├── AccountDeletion/
│   ├── AccountDeletion.jsx
│   └── AccountDeletion.css
```

**주요 기능:**
- 탈퇴 사유 선택 (라디오 버튼)
  - 더 이상 사용하지 않음
  - 다른 서비스 이용
  - 개인정보 보호
  - 불만족
  - 기타 (직접 입력)
- 탈퇴 주의사항 표시
- 확인 체크박스 ("위 내용을 확인했습니다")
- 2단계 확인 모달

**탈퇴 사유 데이터:**
```typescript
// localStorage에 저장 (Analytics 스텁)
{
  reason: string,
  detail: string | null,
  timestamp: string
}
```

### 7.3 안내 모달

**파일:** `src/components/InfoModal/InfoModal.jsx`

**Props:**
```typescript
interface InfoModalProps {
  title: string
  message: string
  onConfirm: () => void
}
```

---

## 🔍 테스트 체크리스트

### 비밀번호 변경
- [ ] 유효성 검증 동작 (8자 이상, 복잡도)
- [ ] 새 비밀번호와 확인 일치 여부 검증
- [ ] 제출 시 안내 모달 표시

### 회원 탈퇴
- [ ] 탈퇴 사유 선택 가능
- [ ] 기타 선택 시 직접 입력 활성화
- [ ] 주의사항 표시
- [ ] 확인 체크박스 필수
- [ ] 2단계 확인 모달 표시
- [ ] localStorage에 사유 저장

---

## ✅ Definition of Done

- [ ] 비밀번호 변경 UI 완성
- [ ] 회원 탈퇴 UI 및 플로우 완성
- [ ] 안내 모달 구현
- [ ] 유효성 검증 동작
- [ ] localStorage에 탈퇴 사유 저장
- [ ] 접근성 준수
- [ ] 반응형 디자인

---

## 🚨 주의사항

1. **Mock 처리**: 실제 API 호출하지 않고 안내 모달로 대체
2. **탈퇴 방지**: 2단계 확인으로 실수 방지
3. **데이터 수집**: 탈퇴 사유는 localStorage에 저장 (추후 분석용)
4. **접근성**: 라디오 버튼 그룹 명확하게 레이블링
5. **주의사항**: 탈퇴 시 복구 불가 등 명확히 안내
