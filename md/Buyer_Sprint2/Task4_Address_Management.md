# Task 4: Address 관리 기능

**담당:** Frontend Team
**예상 소요:** 1.5일 (Day 4-5)
**우선순위:** 🟠 High
**의존성:** Task 1 (인프라), Task 2 (공통 컴포넌트)

---

## 📋 작업 개요

배송지 주소 CRUD 기능과 기본 주소 설정 관리를 구현합니다. 다음 우편번호 API를 통합하여 편리한 주소 입력을 제공합니다.

### 목표
- ✅ 주소 목록 조회 및 표시
- ✅ 주소 추가/수정/삭제 CRUD
- ✅ 기본 주소 단일성 가드
- ✅ 다음 우편번호 API 통합
- ✅ 모달 기반 UX

---

## 🎯 상세 작업 항목

### 4.1 Zod 스키마 정의

**파일:** `src/schemas/address.ts`

```typescript
import { z } from 'zod'

export const addressSchema = z.object({
  member_address_id: z.number().int().positive(),
  member_id: z.number().int().positive(),
  member_address_alias: z.string()
    .min(1, '배송지 이름을 입력하세요')
    .max(20, '배송지 이름은 최대 20자까지 가능합니다'),
  member_address_is_default: z.boolean(),
  member_address_recipient: z.string()
    .min(2, '받는 분 이름은 최소 2자 이상이어야 합니다')
    .max(20, '받는 분 이름은 최대 20자까지 가능합니다'),
  member_address_phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력하세요'),
  member_address_zipcode: z.string()
    .length(5, '우편번호 5자리를 입력하세요'),
  member_address_address1: z.string()
    .min(1, '기본 주소를 입력하세요'),
  member_address_address2: z.string().nullable(),
  member_address_last_used_at: z.string().datetime().nullable(),
  member_address_status: z.enum(['active', 'inactive']),
  member_address_created_at: z.string().datetime(),
  member_address_updated_at: z.string().datetime()
})

export type Address = z.infer<typeof addressSchema>

// 주소 생성/수정용 스키마
export const createAddressSchema = addressSchema.omit({
  member_address_id: true,
  member_id: true,
  member_address_last_used_at: true,
  member_address_status: true,
  member_address_created_at: true,
  member_address_updated_at: true
})

export type CreateAddress = z.infer<typeof createAddressSchema>
```

### 4.2 다음 우편번호 API 유틸

**파일:** `src/utils/postcode.ts`

```typescript
// 다음 우편번호 스크립트 동적 로드
export function loadDaumPostcodeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('우편번호 스크립트 로드 실패'))
    document.head.appendChild(script)
  })
}

// 우편번호 검색 결과 타입
export interface PostcodeResult {
  zonecode: string // 우편번호
  address: string // 기본 주소
  addressEnglish: string // 영문 주소
  addressType: 'R' | 'J' // R: 도로명, J: 지번
  bname: string // 법정동/법정리 이름
  buildingName: string // 건물명
}

// 우편번호 검색 팝업 열기
export function openPostcodePopup(
  onComplete: (data: PostcodeResult) => void
): void {
  loadDaumPostcodeScript().then(() => {
    new window.daum.Postcode({
      oncomplete: onComplete,
      width: '100%',
      height: '100%'
    }).open()
  }).catch((error) => {
    console.error('우편번호 검색 실패:', error)
    alert('우편번호 검색 서비스를 불러올 수 없습니다.')
  })
}

// 우편번호 결과를 폼 필드로 매핑
export function mapPostcodeResult(data: PostcodeResult) {
  return {
    member_address_zipcode: data.zonecode,
    member_address_address1: data.address
  }
}
```

### 4.3 MSW 핸들러

**파일:** `src/mocks/handlers/address.ts`

```typescript
import { http, HttpResponse, delay } from 'msw'
import { createAddressSchema } from '@/schemas/address'
import addressesData from '../data/addresses.json'

let addresses = [...addressesData.addresses]
let nextId = Math.max(...addresses.map(a => a.member_address_id)) + 1

export const addressHandlers = [
  // GET /api/addresses - 주소 목록 조회
  http.get('/api/addresses', async () => {
    await delay(300)
    return HttpResponse.json(addresses.filter(a => a.member_address_status === 'active'))
  }),

  // POST /api/addresses - 주소 추가
  http.post('/api/addresses', async ({ request }) => {
    const body = await request.json()

    try {
      const validated = createAddressSchema.parse(body)
      await delay(500)

      // 기본 주소 설정 시 기존 기본 주소 해제
      if (validated.member_address_is_default) {
        addresses = addresses.map(addr => ({
          ...addr,
          member_address_is_default: false
        }))
      }

      const newAddress = {
        member_address_id: nextId++,
        member_id: 1,
        ...validated,
        member_address_last_used_at: null,
        member_address_status: 'active',
        member_address_created_at: new Date().toISOString(),
        member_address_updated_at: new Date().toISOString()
      }

      addresses.push(newAddress)
      return HttpResponse.json(newAddress, { status: 201 })
    } catch (error) {
      return HttpResponse.json(
        { error: '유효하지 않은 데이터입니다', details: error },
        { status: 400 }
      )
    }
  }),

  // PUT /api/addresses/:id - 주소 수정
  http.put('/api/addresses/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const body = await request.json()

    try {
      const validated = createAddressSchema.parse(body)
      await delay(500)

      const index = addresses.findIndex(a => a.member_address_id === id)
      if (index === -1) {
        return HttpResponse.json({ error: '주소를 찾을 수 없습니다' }, { status: 404 })
      }

      // 기본 주소 설정 시 기존 기본 주소 해제
      if (validated.member_address_is_default) {
        addresses = addresses.map(addr => ({
          ...addr,
          member_address_is_default: addr.member_address_id === id
        }))
      }

      addresses[index] = {
        ...addresses[index],
        ...validated,
        member_address_updated_at: new Date().toISOString()
      }

      return HttpResponse.json(addresses[index])
    } catch (error) {
      return HttpResponse.json(
        { error: '유효하지 않은 데이터입니다', details: error },
        { status: 400 }
      )
    }
  }),

  // DELETE /api/addresses/:id - 주소 삭제
  http.delete('/api/addresses/:id', async ({ params }) => {
    const id = Number(params.id)
    await delay(300)

    const index = addresses.findIndex(a => a.member_address_id === id)
    if (index === -1) {
      return HttpResponse.json({ error: '주소를 찾을 수 없습니다' }, { status: 404 })
    }

    // Soft delete
    addresses[index] = {
      ...addresses[index],
      member_address_status: 'inactive',
      member_address_updated_at: new Date().toISOString()
    }

    return HttpResponse.json({ success: true }, { status: 204 })
  }),

  // PATCH /api/addresses/:id/default - 기본 주소 설정
  http.patch('/api/addresses/:id/default', async ({ params }) => {
    const id = Number(params.id)
    await delay(300)

    const index = addresses.findIndex(a => a.member_address_id === id)
    if (index === -1) {
      return HttpResponse.json({ error: '주소를 찾을 수 없습니다' }, { status: 404 })
    }

    // 모든 주소의 기본 설정 해제 후 선택한 주소만 기본으로 설정
    addresses = addresses.map((addr, idx) => ({
      ...addr,
      member_address_is_default: idx === index,
      member_address_updated_at: new Date().toISOString()
    }))

    return HttpResponse.json(addresses[index])
  })
]
```

### 4.4 React Query Hook

**파일:** `src/hooks/useAddress.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/lib/http'
import { Address, CreateAddress, addressSchema } from '@/schemas/address'
import toast from 'react-hot-toast'

// 주소 목록 조회
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const data = await fetcher<Address[]>('/api/addresses')
      return data.map(addr => addressSchema.parse(addr))
    }
  })
}

// 주소 추가
export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAddress) => {
      return fetcher<Address>('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('배송지가 추가되었습니다')
    },
    onError: () => {
      toast.error('배송지 추가에 실패했습니다')
    }
  })
}

// 주소 수정
export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateAddress }) => {
      return fetcher<Address>(`/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('배송지가 수정되었습니다')
    },
    onError: () => {
      toast.error('배송지 수정에 실패했습니다')
    }
  })
}

// 주소 삭제
export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return fetcher(`/api/addresses/${id}`, { method: 'DELETE' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('배송지가 삭제되었습니다')
    },
    onError: () => {
      toast.error('배송지 삭제에 실패했습니다')
    }
  })
}

// 기본 주소 설정
export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return fetcher<Address>(`/api/addresses/${id}/default`, {
        method: 'PATCH'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('기본 배송지로 설정되었습니다')
    },
    onError: () => {
      toast.error('기본 배송지 설정에 실패했습니다')
    }
  })
}
```

### 4.5 Address 폼 컴포넌트

**파일:** `src/components/AddressForm/AddressForm.jsx`

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAddressSchema } from '@/schemas/address'
import { openPostcodePopup, mapPostcodeResult } from '@/utils/postcode'
import './AddressForm.css'

export default function AddressForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createAddressSchema),
    defaultValues: initialData || {
      member_address_alias: '',
      member_address_is_default: false,
      member_address_recipient: '',
      member_address_phone: '',
      member_address_zipcode: '',
      member_address_address1: '',
      member_address_address2: ''
    }
  })

  const handleSearchAddress = () => {
    openPostcodePopup((data) => {
      const mapped = mapPostcodeResult(data)
      setValue('member_address_zipcode', mapped.member_address_zipcode)
      setValue('member_address_address1', mapped.member_address_address1)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="address-form">
      {/* 배송지 이름 */}
      <div className="form-group">
        <label htmlFor="alias" className="form-label">
          배송지 이름 <span className="required">*</span>
        </label>
        <input
          id="alias"
          type="text"
          placeholder="예: 집, 회사"
          {...register('member_address_alias')}
          className={`form-input ${errors.member_address_alias ? 'form-input--error' : ''}`}
        />
        {errors.member_address_alias && (
          <span className="form-error">{errors.member_address_alias.message}</span>
        )}
      </div>

      {/* 받는 분 */}
      <div className="form-group">
        <label htmlFor="recipient" className="form-label">
          받는 분 <span className="required">*</span>
        </label>
        <input
          id="recipient"
          type="text"
          {...register('member_address_recipient')}
          className={`form-input ${errors.member_address_recipient ? 'form-input--error' : ''}`}
        />
        {errors.member_address_recipient && (
          <span className="form-error">{errors.member_address_recipient.message}</span>
        )}
      </div>

      {/* 연락처 */}
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          연락처 <span className="required">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="010-0000-0000"
          {...register('member_address_phone')}
          className={`form-input ${errors.member_address_phone ? 'form-input--error' : ''}`}
        />
        {errors.member_address_phone && (
          <span className="form-error">{errors.member_address_phone.message}</span>
        )}
      </div>

      {/* 우편번호 */}
      <div className="form-group">
        <label htmlFor="zipcode" className="form-label">
          우편번호 <span className="required">*</span>
        </label>
        <div className="input-group">
          <input
            id="zipcode"
            type="text"
            readOnly
            {...register('member_address_zipcode')}
            className="form-input"
          />
          <button
            type="button"
            onClick={handleSearchAddress}
            className="btn btn--secondary"
          >
            우편번호 찾기
          </button>
        </div>
        {errors.member_address_zipcode && (
          <span className="form-error">{errors.member_address_zipcode.message}</span>
        )}
      </div>

      {/* 기본 주소 */}
      <div className="form-group">
        <label htmlFor="address1" className="form-label">
          주소 <span className="required">*</span>
        </label>
        <input
          id="address1"
          type="text"
          readOnly
          {...register('member_address_address1')}
          className="form-input"
        />
        {errors.member_address_address1 && (
          <span className="form-error">{errors.member_address_address1.message}</span>
        )}
      </div>

      {/* 상세 주소 */}
      <div className="form-group">
        <label htmlFor="address2" className="form-label">상세 주소</label>
        <input
          id="address2"
          type="text"
          placeholder="동, 호수 등"
          {...register('member_address_address2')}
          className="form-input"
        />
      </div>

      {/* 기본 배송지 설정 */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            {...register('member_address_is_default')}
            className="checkbox-input"
          />
          <span>기본 배송지로 설정</span>
        </label>
      </div>

      {/* 버튼 */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn--secondary"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn--primary"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
```

---

## 🔍 테스트 체크리스트

### 기능 테스트
- [ ] 주소 목록 조회 동작
- [ ] 주소 추가 동작
- [ ] 주소 수정 동작
- [ ] 주소 삭제 동작
- [ ] 기본 주소 설정 시 기존 기본 주소 자동 해제
- [ ] 다음 우편번호 팝업 정상 작동
- [ ] 우편번호 검색 결과 폼에 자동 입력

### 유효성 검증
- [ ] 필수 필드 누락 시 에러
- [ ] 전화번호 형식 검증
- [ ] 우편번호 5자리 검증

### UX
- [ ] 모달 열림/닫힘 자연스러움
- [ ] Toast 알림 표시
- [ ] 로딩 상태 표시

---

## ✅ Definition of Done

- [ ] 주소 CRUD 모든 동작 완료
- [ ] 기본 주소 단일성 가드 구현
- [ ] 다음 우편번호 API 통합
- [ ] MSW 핸들러 동작 확인
- [ ] RHF + Zod 유효성 검증
- [ ] Toast 알림 통합
- [ ] 접근성 준수
- [ ] 반응형 디자인

---

## 📚 참고 자료

- [Daum Postcode API](https://postcode.map.daum.net/guide)
- [React Hook Form](https://react-hook-form.com/)

---

## 🚨 주의사항

1. **기본 주소 단일성**: 반드시 1개만 존재하도록 보장
2. **다음 API 스크립트**: 동적 로드로 번들 크기 최소화
3. **Soft Delete**: 실제 삭제 대신 status를 inactive로 변경
4. **읽기 전용 필드**: 우편번호, 기본주소는 readonly
5. **에러 처리**: 다음 API 로드 실패 시 사용자 안내
