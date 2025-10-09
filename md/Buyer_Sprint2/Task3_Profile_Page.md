# Task 3: Profile 페이지 고도화

**담당:** Frontend Team
**예상 소요:** 1일 (Day 3-4)
**우선순위:** 🟠 High
**의존성:** Task 1 (인프라), Task 2 (공통 컴포넌트)

---

## 📋 작업 개요

사용자 프로필 조회 및 수정 기능을 RHF + Zod 기반으로 구현합니다. Optimistic UI 업데이트와 에러 처리를 통해 사용자 경험을 극대화합니다.

### 목표
- ✅ React Hook Form + Zod 유효성 검증
- ✅ Optimistic UI 업데이트
- ✅ 실시간 유효성 피드백
- ✅ Toast 알림 통합
- ✅ 변경 불가 필드 명확한 표시

---

## 🎯 상세 작업 항목

### 3.1 Zod 스키마 정의

**파일:** `src/schemas/member.ts`

```typescript
import { z } from 'zod'

// 전체 Member 스키마
export const memberSchema = z.object({
  member_id: z.number().int().positive(),
  company_id: z.number().int().positive().nullable(),
  member_email: z.string().email('유효한 이메일을 입력하세요'),
  member_password: z.string().nullable(),
  member_name: z.string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자까지 가능합니다'),
  member_nickname: z.string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(20, '닉네임은 최대 20자까지 가능합니다'),
  member_phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력하세요')
    .nullable(),
  member_account_type: z.enum(['individual', 'business']),
  member_account_role: z.enum(['buyer', 'seller', 'admin']),
  member_status: z.enum(['active', 'suspended', 'inactive']),
  member_marketing_email: z.boolean(),
  member_marketing_sms: z.boolean(),
  member_last_login_at: z.string().datetime().nullable(),
  member_created_at: z.string().datetime(),
  member_updated_at: z.string().datetime()
})

export type Member = z.infer<typeof memberSchema>

// 프로필 수정용 스키마 (수정 가능한 필드만)
export const updateProfileSchema = memberSchema.pick({
  member_name: true,
  member_nickname: true,
  member_phone: true,
  member_marketing_email: true,
  member_marketing_sms: true
})

export type UpdateProfile = z.infer<typeof updateProfileSchema>
```

### 3.2 MSW 핸들러 추가

**파일:** `src/mocks/handlers/member.ts`

```typescript
import { http, HttpResponse, delay } from 'msw'
import { updateProfileSchema } from '@/schemas/member'
import membersData from '../data/members.json'

let currentMember = { ...membersData.members[0] }

export const memberHandlers = [
  // GET /api/member/profile - 프로필 조회
  http.get('/api/member/profile', async () => {
    await delay(300)

    return HttpResponse.json(currentMember)
  }),

  // PUT /api/member/profile - 프로필 수정
  http.put('/api/member/profile', async ({ request }) => {
    const body = await request.json()

    try {
      // Zod 유효성 검증
      const validated = updateProfileSchema.parse(body)

      await delay(500)

      // 에러 시뮬레이션 (10% 확률)
      if (Math.random() < 0.1) {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        )
      }

      // Mock 데이터 업데이트
      currentMember = {
        ...currentMember,
        ...validated,
        member_updated_at: new Date().toISOString()
      }

      return HttpResponse.json(currentMember)
    } catch (error) {
      return HttpResponse.json(
        { error: '유효하지 않은 데이터입니다', details: error },
        { status: 400 }
      )
    }
  })
]
```

### 3.3 React Query Hook

**파일:** `src/hooks/useProfile.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/lib/http'
import { Member, UpdateProfile, memberSchema, updateProfileSchema } from '@/schemas/member'
import toast from 'react-hot-toast'

// 프로필 조회
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await fetcher<Member>('/api/member/profile')
      return memberSchema.parse(data) // 응답 검증
    }
  })
}

// 프로필 수정
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfile) => {
      // 요청 전 검증
      const validated = updateProfileSchema.parse(data)

      return fetcher<Member>('/api/member/profile', {
        method: 'PUT',
        body: JSON.stringify(validated)
      })
    },

    // Optimistic Update
    onMutate: async (newData) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      // 이전 데이터 백업
      const previousProfile = queryClient.getQueryData<Member>(['profile'])

      // Optimistic 데이터로 업데이트
      if (previousProfile) {
        queryClient.setQueryData<Member>(['profile'], {
          ...previousProfile,
          ...newData,
          member_updated_at: new Date().toISOString()
        })
      }

      return { previousProfile }
    },

    onError: (error, variables, context) => {
      // 에러 시 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }

      toast.error('프로필 수정에 실패했습니다')
    },

    onSuccess: () => {
      toast.success('프로필이 수정되었습니다')
    },

    onSettled: () => {
      // 성공/실패 상관없이 refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}
```

### 3.4 Profile 페이지 컴포넌트

**파일:** `src/pages/Profile/Profile.jsx`

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { updateProfileSchema } from '@/schemas/member'
import ErrorState from '@/components/ErrorState'
import SkeletonList from '@/components/SkeletonList'
import './Profile.css'

export default function Profile() {
  const { data: profile, isLoading, error, refetch } = useProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    values: profile ? {
      member_name: profile.member_name,
      member_nickname: profile.member_nickname,
      member_phone: profile.member_phone || '',
      member_marketing_email: profile.member_marketing_email,
      member_marketing_sms: profile.member_marketing_sms
    } : undefined
  })

  const onSubmit = async (data) => {
    await updateProfile.mutateAsync(data)
  }

  if (isLoading) {
    return <SkeletonList count={5} variant="list" height="60px" />
  }

  if (error) {
    return (
      <ErrorState
        title="프로필을 불러올 수 없습니다"
        error={error}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="profile-page">
      <h2 className="profile-page__title">프로필 설정</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        {/* 읽기 전용 필드 */}
        <div className="form-group">
          <label className="form-label">이메일</label>
          <input
            type="email"
            value={profile.member_email}
            disabled
            className="form-input form-input--disabled"
          />
          <span className="form-hint">이메일은 변경할 수 없습니다</span>
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="member_name" className="form-label">
            이름 <span className="required">*</span>
          </label>
          <input
            id="member_name"
            type="text"
            {...register('member_name')}
            className={`form-input ${errors.member_name ? 'form-input--error' : ''}`}
            aria-invalid={errors.member_name ? 'true' : 'false'}
            aria-describedby={errors.member_name ? 'member_name-error' : undefined}
          />
          {errors.member_name && (
            <span id="member_name-error" className="form-error" role="alert">
              {errors.member_name.message}
            </span>
          )}
        </div>

        {/* 닉네임 */}
        <div className="form-group">
          <label htmlFor="member_nickname" className="form-label">
            닉네임 <span className="required">*</span>
          </label>
          <input
            id="member_nickname"
            type="text"
            {...register('member_nickname')}
            className={`form-input ${errors.member_nickname ? 'form-input--error' : ''}`}
            aria-invalid={errors.member_nickname ? 'true' : 'false'}
            aria-describedby={errors.member_nickname ? 'member_nickname-error' : undefined}
          />
          {errors.member_nickname && (
            <span id="member_nickname-error" className="form-error" role="alert">
              {errors.member_nickname.message}
            </span>
          )}
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="member_phone" className="form-label">전화번호</label>
          <input
            id="member_phone"
            type="tel"
            placeholder="010-0000-0000"
            {...register('member_phone')}
            className={`form-input ${errors.member_phone ? 'form-input--error' : ''}`}
            aria-invalid={errors.member_phone ? 'true' : 'false'}
            aria-describedby={errors.member_phone ? 'member_phone-error' : undefined}
          />
          {errors.member_phone && (
            <span id="member_phone-error" className="form-error" role="alert">
              {errors.member_phone.message}
            </span>
          )}
        </div>

        {/* 마케팅 동의 */}
        <div className="form-group">
          <label className="form-label">마케팅 수신 동의</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('member_marketing_email')}
                className="checkbox-input"
              />
              <span>이메일 수신 동의</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('member_marketing_sms')}
                className="checkbox-input"
              />
              <span>SMS 수신 동의</span>
            </label>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="btn btn--primary"
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

---

## 🔍 테스트 체크리스트

### 기능 테스트
- [ ] 프로필 데이터가 올바르게 로드됨
- [ ] 폼 필드가 기존 값으로 초기화됨
- [ ] 유효성 검증이 실시간으로 동작
- [ ] 수정 후 저장 시 Optimistic UI 업데이트 확인
- [ ] 에러 발생 시 롤백 동작 확인
- [ ] Toast 알림이 올바르게 표시됨

### 유효성 검증
- [ ] 이름 2자 미만 시 에러
- [ ] 이름 20자 초과 시 에러
- [ ] 전화번호 형식 검증 (010-0000-0000)
- [ ] 빈 전화번호 허용 (nullable)

### 접근성
- [ ] 폼 레이블과 input 연결 (htmlFor, id)
- [ ] 에러 메시지에 role="alert"
- [ ] aria-invalid, aria-describedby 적용
- [ ] 키보드로 전체 폼 조작 가능

---

## ✅ Definition of Done

- [ ] RHF + Zod 유효성 검증 동작
- [ ] Optimistic UI 업데이트 구현
- [ ] 에러 처리 및 롤백 로직 완료
- [ ] Toast 알림 통합
- [ ] 접근성 준수 (ARIA 속성)
- [ ] MSW 핸들러 동작 확인
- [ ] 반응형 디자인 적용
- [ ] 변경 불가 필드 명확한 표시

---

## 📚 참고 자료

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod + RHF Integration](https://react-hook-form.com/get-started#SchemaValidation)
- [React Query Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [React Hot Toast](https://react-hot-toast.com/)

---

## 🚨 주의사항

1. **Optimistic UI**: 성공 가정하되 에러 시 즉시 롤백
2. **유효성 검증**: 클라이언트 + 서버(Mock) 이중 검증
3. **에러 메시지**: 사용자 친화적이고 구체적으로
4. **성능**: isDirty 체크로 불필요한 제출 방지
5. **접근성**: 모든 입력 필드에 레이블 및 ARIA 속성 필수
