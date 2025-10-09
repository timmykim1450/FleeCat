const bcrypt = require('bcrypt');
const memberRepository = require('../repositories/member.repository');
const memberPermissionRepository = require('../repositories/memberPermission.repository');
const { generateToken } = require('../utils/jwt');
const { ValidationError, UnauthorizedError, NotFoundError } = require('../utils/errors');

/**
 * Auth Service
 * 회원가입, 로그인, 비밀번호 변경 등 인증 관련 비즈니스 로직
 */

/**
 * 회원가입
 *
 * @description
 * 새로운 회원을 생성하고 기본 권한(buyer)을 부여합니다.
 * - 이메일 중복 확인
 * - 닉네임 중복 확인
 * - 비밀번호 해싱
 * - 회원 생성
 * - 권한 부여
 * - JWT 토큰 발급
 *
 * @param {Object} data - 회원가입 데이터
 * @param {string} data.email - 이메일
 * @param {string} data.password - 비밀번호 (평문)
 * @param {string} data.name - 이름
 * @param {string} data.nickname - 닉네임
 * @param {string} [data.phone] - 전화번호 (선택)
 *
 * @returns {Promise<Object>} { member, token }
 * @throws {ValidationError} 이메일 또는 닉네임 중복 시
 *
 * @example
 * const result = await authService.register({
 *   email: 'user@example.com',
 *   password: 'secure123!',
 *   name: '홍길동',
 *   nickname: '길동이',
 *   phone: '010-1234-5678'
 * });
 * // 반환: { member: {...}, token: "eyJhbGci..." }
 */
async function register(data) {
  const { email, password, name, nickname, phone } = data;

  // 1. 이메일 중복 확인
  const emailExists = await memberRepository.existsByEmail(email);
  if (emailExists) {
    throw new ValidationError('Email already exists');
  }

  // 2. 닉네임 중복 확인
  const nicknameExists = await memberRepository.existsByNickname(nickname);
  if (nicknameExists) {
    throw new ValidationError('Nickname already exists');
  }

  // 3. 비밀번호 해싱 (salt rounds: 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. 회원 생성
  const member = await memberRepository.create({
    member_email: email,
    member_password: hashedPassword,
    member_name: name,
    member_nickname: nickname,
    member_phone: phone || null,
    member_status: 'active'
  });

  // 5. 기본 권한(buyer) 부여
  await memberPermissionRepository.create({
    member_id: Number(member.member_id),
    permission_role: 'buyer'
  });

  // 6. JWT 토큰 생성
  const token = generateToken({
    member_id: Number(member.member_id),
    email: member.member_email,
    role: 'buyer'
  });

  // 7. 비밀번호 제외하고 반환
  const { member_password, ...memberData } = member;

  return {
    member: {
      ...memberData,
      member_id: Number(memberData.member_id),
      company_id: memberData.company_id ? Number(memberData.company_id) : null,
      role: 'buyer',
      roles: ['buyer']
    },
    token
  };
}

/**
 * 로그인
 *
 * @description
 * 이메일과 비밀번호로 로그인합니다.
 * - 이메일로 회원 조회
 * - 회원 상태 확인 (active만 로그인 가능)
 * - 비밀번호 검증
 * - 권한 조회
 * - JWT 토큰 발급
 *
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호 (평문)
 *
 * @returns {Promise<Object>} { member, token }
 * @throws {UnauthorizedError} 이메일/비밀번호 오류, 계정 정지/삭제 시
 *
 * @example
 * const result = await authService.login('user@example.com', 'secure123!');
 * // 반환: { member: {...}, token: "eyJhbGci..." }
 */
async function login(email, password) {
  // 1. 이메일로 회원 조회
  const member = await memberRepository.findByEmail(email);

  if (!member) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // 2. 회원 상태 확인
  if (member.member_status !== 'active') {
    throw new UnauthorizedError('Account is suspended or deleted');
  }

  // 3. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, member.member_password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // 4. 권한 조회
  const primaryRole = await memberPermissionRepository.getPrimaryRole(Number(member.member_id));
  const allRoles = await memberPermissionRepository.getRoles(Number(member.member_id));

  // 5. JWT 토큰 생성
  const token = generateToken({
    member_id: Number(member.member_id),
    email: member.member_email,
    role: primaryRole,
    roles: allRoles
  });

  // 6. 비밀번호 및 관계 데이터 제외하고 반환
  const { member_password, member_permissions, company, ...memberData } = member;

  return {
    member: {
      ...memberData,
      member_id: Number(memberData.member_id),
      company_id: memberData.company_id ? Number(memberData.company_id) : null,
      role: primaryRole,
      roles: allRoles
    },
    token
  };
}

/**
 * 비밀번호 변경
 *
 * @description
 * 현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.
 * - 회원 조회
 * - 현재 비밀번호 확인
 * - 새 비밀번호와 현재 비밀번호 다른지 확인
 * - 새 비밀번호 해싱 및 저장
 *
 * @param {number} memberId - 회원 ID
 * @param {string} currentPassword - 현재 비밀번호 (평문)
 * @param {string} newPassword - 새 비밀번호 (평문)
 *
 * @returns {Promise<Object>} { message }
 * @throws {UnauthorizedError} 현재 비밀번호 오류 시
 * @throws {ValidationError} 새 비밀번호가 현재 비밀번호와 같을 시
 * @throws {NotFoundError} 회원을 찾을 수 없을 시
 *
 * @example
 * await authService.changePassword(123, 'oldpass123!', 'newpass456!');
 * // 반환: { message: 'Password changed successfully' }
 */
async function changePassword(memberId, currentPassword, newPassword) {
  // 1. 회원 조회
  const member = await memberRepository.findById(memberId);

  if (!member) {
    throw new NotFoundError('Member not found');
  }

  // 2. 현재 비밀번호 확인
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, member.member_password);

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // 3. 새 비밀번호가 현재 비밀번호와 같은지 확인
  const isSameAsCurrentPassword = await bcrypt.compare(newPassword, member.member_password);

  if (isSameAsCurrentPassword) {
    throw new ValidationError('New password must be different from current password');
  }

  // 4. 새 비밀번호 해싱
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // 5. 비밀번호 업데이트
  await memberRepository.updatePassword(memberId, hashedNewPassword);

  return {
    message: 'Password changed successfully'
  };
}

module.exports = {
  register,
  login,
  changePassword
};
