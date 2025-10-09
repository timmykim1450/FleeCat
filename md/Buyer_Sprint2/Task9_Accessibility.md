# Task 9: 접근성 고도화

**담당:** Frontend Team
**예상 소요:** 1일 (Day 8-9)
**우선순위:** 🔴 Critical
**의존성:** Task 2-7 (전체 컴포넌트)

---

## 📋 작업 개요

WCAG 2.1 AA 수준의 접근성을 구현합니다.

### 목표
- ✅ 모달 포커스 트랩
- ✅ 키보드 내비게이션
- ✅ ARIA 속성 추가
- ✅ 색상 대비 검증
- ✅ 스크린 리더 대응

---

## 🎯 상세 작업 항목

### 9.1 모달 포커스 관리

**대상 컴포넌트:**
- OrderDetailModal
- AddressForm (모달)
- 확인/안내 모달

**구현 사항:**
- 모달 열릴 때 첫 번째 포커스 가능 요소로 포커스
- Tab/Shift+Tab으로 모달 내부에서만 순환
- ESC 키로 닫기
- 모달 닫힐 때 원래 포커스 위치로 복귀

### 9.2 키보드 내비게이션

**개선 대상:**
- StatusChip: Space/Enter로 선택
- DateRangePicker: Tab으로 필드 이동, Arrow로 날짜 선택
- 페이지네이션: Arrow 키 지원
- 드롭다운: Arrow 키로 옵션 선택

**Skip Links:**
- "본문으로 건너뛰기" 링크 추가
- 주요 섹션으로 빠른 이동

### 9.3 ARIA 속성 점검

**필수 속성:**
- `role`: alert, dialog, navigation, main, complementary
- `aria-label`: 아이콘 버튼, 장식적이지 않은 이미지
- `aria-labelledby`: 모달 제목 연결
- `aria-describedby`: 에러 메시지 연결
- `aria-invalid`: 유효성 검증 실패 필드
- `aria-required`: 필수 입력 필드
- `aria-live`: 동적 콘텐츠 업데이트 알림
- `aria-pressed`: 토글 버튼 상태
- `aria-expanded`: 드롭다운/아코디언 상태

### 9.4 색상 대비 검증

**검증 대상:**
- 모든 텍스트와 배경: 4.5:1 이상
- 큰 텍스트 (18pt+): 3:1 이상
- 포커스 인디케이터: 3:1 이상
- 버튼/링크: 호버 상태 명확

**도구:** Chrome DevTools Lighthouse, axe DevTools

### 9.5 스크린 리더 테스트

**테스트 항목:**
- 폼 레이블 읽기
- 에러 메시지 알림
- 동적 콘텐츠 변경 알림
- 이미지 대체 텍스트
- 모달 진입/퇴장 안내

---

## 🔍 테스트 체크리스트

### 키보드
- [ ] Tab으로 모든 인터랙티브 요소 접근 가능
- [ ] 포커스 인디케이터가 명확하게 보임
- [ ] 논리적 탭 순서
- [ ] ESC로 모달/드롭다운 닫기

### 스크린 리더
- [ ] NVDA/JAWS로 페이지 탐색 가능
- [ ] 폼 레이블 정확히 읽힘
- [ ] 에러 메시지 즉시 알림
- [ ] 랜드마크 영역 식별 가능

### 시각
- [ ] 200% 확대 시 레이아웃 깨지지 않음
- [ ] 텍스트 간격 조정 가능
- [ ] 색상 대비 충분
- [ ] 다크모드에서도 대비 유지

---

## ✅ Definition of Done

- [ ] 모든 모달에 포커스 트랩 구현
- [ ] 키보드만으로 전체 기능 사용 가능
- [ ] ARIA 속성 적절히 적용
- [ ] 색상 대비 WCAG AA 준수
- [ ] Lighthouse 접근성 점수 90+ 달성
- [ ] NVDA/JAWS 테스트 통과

---

## 📦 도구

```bash
# axe DevTools (Chrome Extension)
# Lighthouse (Chrome DevTools)
# NVDA (Windows 스크린 리더)
```

---

## 📚 참고 자료

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🚨 주의사항

1. **순서 중요**: 시각적 순서와 DOM 순서 일치
2. **중복 방지**: aria-label과 실제 텍스트 중복 금지
3. **과도한 ARIA**: 불필요한 ARIA는 오히려 해로움
4. **테스트 필수**: 실제 스크린 리더로 테스트
5. **포커스 스타일**: outline 제거 시 대체 스타일 필수
