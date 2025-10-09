# Task 8: 디자인 시스템 고도화

**담당:** Frontend Team
**예상 소요:** 1일 (Day 7-8)
**우선순위:** 🟡 Medium (Should)
**의존성:** Task 2 (공통 컴포넌트)

---

## 📋 작업 개요

일관된 디자인 토큰 시스템과 다크모드를 구축합니다.

### 목표
- ✅ CSS 변수 기반 디자인 토큰
- ✅ 다크모드 토글 컴포넌트
- ✅ 테마 전환 애니메이션
- ✅ localStorage 테마 저장

---

## 🎯 상세 작업 항목

### 8.1 디자인 토큰 정의

**파일:** `src/styles/tokens.css`

**토큰 카테고리:**
- **Colors**: Primary, Secondary, Success, Error, Warning, Info
- **Typography**: Font family, sizes, weights, line-heights
- **Spacing**: 4px 기반 스케일 (4, 8, 12, 16, 24, 32, 48, 64)
- **Border**: Radius, width
- **Shadow**: 5단계 (xs, sm, md, lg, xl)
- **Transition**: Duration, easing

**라이트/다크 테마:**
```css
:root {
  /* 라이트 테마 */
}

[data-theme="dark"] {
  /* 다크 테마 */
}
```

### 8.2 다크모드 토글

**파일:** `src/components/ThemeToggle/ThemeToggle.jsx`

**기능:**
- 토글 버튼 (Sun/Moon 아이콘)
- Context API로 전역 상태 관리
- localStorage에 테마 저장
- 페이지 로드 시 저장된 테마 복원
- prefers-color-scheme 미디어 쿼리 지원

**테마 Context 구조:**
```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

### 8.3 전환 애니메이션

**구현 방법:**
- CSS transitions로 부드러운 색상 전환
- `transition: background-color 0.3s ease, color 0.3s ease`
- prefers-reduced-motion 고려

---

## 🔍 테스트 체크리스트

- [ ] 모든 컴포넌트가 라이트/다크 테마에서 정상 작동
- [ ] 토글 버튼 동작 확인
- [ ] 페이지 새로고침 후 테마 유지
- [ ] 시스템 설정(prefers-color-scheme) 감지
- [ ] 색상 대비 WCAG AA 준수
- [ ] 전환 애니메이션 자연스러움

---

## ✅ Definition of Done

- [ ] 디자인 토큰 정의 완료
- [ ] 다크모드 토글 구현
- [ ] 모든 페이지/컴포넌트 적용
- [ ] localStorage 저장/복원
- [ ] 접근성 준수
- [ ] 색상 대비 검증

---

## 📚 참고 자료

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [Design Tokens](https://www.designtokens.org/)

---

## 🚨 주의사항

1. **색상 대비**: WCAG AA 기준 4.5:1 이상 유지
2. **일관성**: 하드코딩된 색상 완전히 제거
3. **성능**: CSS 변수 변경 시 reflow 최소화
4. **접근성**: 다크모드도 동일한 가독성 제공
5. **초기값**: 시스템 설정 우선, localStorage 차선
